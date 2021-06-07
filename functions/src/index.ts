import { sleep } from './utils/timer';
import { loginInfo } from './funclub-config';
const puppeteer = require('puppeteer');
// import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
// TODO:当落確認期間と、受付終了しているもののステータスを更新する
// 当落確認期間と受付終了のtitleAndLinksを作成（オブジェクトの配列にする？）
// 取得したドキュメント.eventIdにファンクラブサイトから取得したeventIdが存在したらstatusを更新

export const events = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    (async () => {
      const eventIds: string[] = [];
      await admin
        .firestore()
        .collection('ticketInfo')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            eventIds.push(doc.id);
          });
        });
      console.log('eventId: ', eventIds);

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto('https://www.up-fc.jp/helloproject/fanclub_Login.php');
      await page.type('input[name="User_No"]', loginInfo.userNo);
      await page.type('input[name="User_LoginPassword"]', loginInfo.password);
      await page.click(
        '#main > div.contents-body > div:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > form > p:nth-child(5) > input[type=checkbox]'
      );
      await page.click('input[name="@Control_Name@"]');
      await sleep(1000);
      await page.goto(
        'https://www.up-fc.jp/helloproject/fan_AllEventTour_List.php'
      );
      await sleep(1000);
      // TODO: 現状、プロト作成のため期間を取得するのに、ループをたくさんしている
      // もっと良い方法（パフォーマンス的に）がないか検討する
      interface TitleAndLink {
        title: string;
        link: string;
      }

      const titlesAndLinks: TitleAndLink[] = await page.evaluate(() => {
        const dataList: TitleAndLink[] = [];
        const nodeList: NodeListOf<HTMLBaseElement> =
          document.querySelectorAll('tr a');

        nodeList.forEach((_node) => {
          // 現在受付中ものの、リンクを取得する
          if (_node.innerText.indexOf('[受付中]') != -1) {
            const acceptedTitlesAndLinks: TitleAndLink = {
              title: _node.innerText.replace('[受付中]', ''),
              link: _node.href,
            };
            dataList.push(acceptedTitlesAndLinks);
          }
        });
        return dataList;
      });

      // '受付中'の公演の数だけくり返す
      for (const data of titlesAndLinks) {
        // 申込期間、当落確認期間、入金締切日のページ
        await page.goto(data.link);

        // タイトルを取得する
        const title: string = data.title;

        // TODO：innerTextを取得してから申込期間を取得する？
        // 申込期間を取得する
        const getApplicationPeriod: string = await page.evaluate(() => {
          const tableInfo: NodeListOf<HTMLBaseElement> = document
            .querySelectorAll('table')[1]
            .querySelectorAll('tbody tr td');
          const tableText: string = tableInfo[0].innerText;
          // const tableText = document
          //   .querySelectorAll('table')[1]
          //   .querySelectorAll('tbody tr td')[0].innerText;
          const numberOfCharactersToTheFirstLineBreak: number =
            tableText.indexOf('\n', 0) - 1;
          const applicationPeriod: string = tableText.substr(
            1,
            numberOfCharactersToTheFirstLineBreak
          );
          return applicationPeriod;
        });

        // 当選落選確認期間を取得する
        const getConfirmationPeriodForWinningAndLosing: string =
          await page.evaluate(() => {
            const tableInfo: NodeListOf<HTMLBaseElement> = document
              .querySelectorAll('table')[1]
              .querySelectorAll('tbody tr td');
            const tableText: string = tableInfo[1].innerText;
            const numberOfCharactersToTheFirstLineBreak: number =
              tableText.indexOf('\n', 0);
            const winningAndLosingPeriod: string = tableText.substr(
              0,
              numberOfCharactersToTheFirstLineBreak
            );
            return winningAndLosingPeriod;
          });

        // 入金締切日を取得する
        const getDepositDeadline: string = await page.evaluate(() => {
          const tdSelector: NodeListOf<HTMLBaseElement> = document
            .querySelectorAll('table')[1]
            .querySelectorAll('tbody tr td');
          const tableText: string =
            tdSelector.length > 3 ? tdSelector[3].innerText : ' 当日入金';
          // const numberOfCharactersToTheFirstLineBreak = tableText.indexOf('\n', 0);
          const depositDeadline: string = tableText.substr(1);
          return depositDeadline;
        });

        // 公演選択のページ
        await page.click(
          '#main > div.contents-body > div > p:nth-child(2) > a > img'
        );
        await sleep(1000);

        const docNameEventId: string = await page.evaluate(() => {
          const select: any = document.querySelectorAll(
            'select[name="Event_ID"]'
          )[0];
          const eventId: string = select.options[1].value;
          return eventId;
        });

        if (eventIds.includes(docNameEventId)) {
          return;
        }

        // 公演を選択して、公演開催日のページへ
        const selectPerformance = await page.evaluate(() => {
          const select: any = document.querySelectorAll(
            'select[name="Event_ID"]'
          )[0];
          select.options[1].selected = true;
        });
        await selectPerformance;
        await page.click('input[name="@Control_Name@"]');
        await sleep(1000);

        interface PerfomanceInfo {
          performanceDay: string;
          meetingPlace: string;
          openingTime: string;
          startTime: string;
        }

        // 公演の数だけループして、公演の情報を取得する
        const performances: PerfomanceInfo[] = await page.evaluate(() => {
          const formEntry: NodeListOf<HTMLBaseElement> =
            document.querySelectorAll('form[name="form_Entry"]');
          const performances = [];
          for (let i = 0; i < formEntry.length; i++) {
            const tableInfo: NodeListOf<HTMLBaseElement> =
              formEntry[i].querySelectorAll('table tbody tr td');
            const performanceDay: string = '公演日: '.concat(
              tableInfo[2].innerText
            );
            const meetingPlace: string = '会場: '.concat(
              tableInfo[3].innerText.replace('\n', ' ')
            );
            const openingTime: string = tableInfo[4].innerText.replace(
              '\n',
              ': '
            );
            const startTime: string = tableInfo[5].innerText.replace(
              '\n',
              ': '
            );

            const performanceInfo: PerfomanceInfo = {
              performanceDay: performanceDay,
              meetingPlace: meetingPlace,
              openingTime: openingTime,
              startTime: startTime,
            };
            performances.push(performanceInfo);
          }
          return performances;
        });

        interface TicketInfo {
          id: string;
          title: string;
          applicationPeriod: string;
          confirmPeriodForWinAndLose: string;
          depositDeadline: string;
          status: number;
        }

        const ticketInfo: TicketInfo = {
          id: docNameEventId,
          title: title,
          applicationPeriod: getApplicationPeriod,
          confirmPeriodForWinAndLose: getConfirmationPeriodForWinningAndLosing,
          depositDeadline: getDepositDeadline,
          status: 1,
        };

        console.log('タイトル： ', title);
        console.log('申込期間： ', getApplicationPeriod);
        console.log(
          '当落確認期間： ',
          getConfirmationPeriodForWinningAndLosing
        );
        console.log('入金締切日： ', getDepositDeadline);

        // TODO: ドルdocNameほにゃららとしなくても動くか確認する
        const ticketInfoRef = admin
          .firestore()
          .collection('ticketInfo')
          .doc(docNameEventId);
        ticketInfoRef.set(ticketInfo);

        performances.map((performance, index) => {
          ticketInfoRef
            .collection('performances')
            .doc(docNameEventId + '-' + index)
            .set(performance)
            .then(function () {
              console.log(
                'Document successfully written!',
                ' eventId: ',
                docNameEventId
              );
            })
            .catch(function (error) {
              console.error(
                'Error writing document: ',
                ' eventId: ',
                docNameEventId,
                error
              );
            });
        });
      }
      await browser.close();
    })();
  });
