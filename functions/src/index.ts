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
        .collection('hEvents')
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
      await Promise.all([
        page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }),
        await page.click(
          '#main > div.contents-body > div:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > form > p:nth-child(5) > input[type=checkbox]'
        ),
        await page.click('input[name="@Control_Name@"]'),
      ]);
      await sleep(1000);
      await page.goto(
        'https://www.up-fc.jp/helloproject/fan_AllEventTour_List.php'
      );
      await sleep(1000);
      // TODO: 現状、プロト作成のため期間を取得するのに、ループをたくさんしている
      // もっと良い方法（パフォーマンス的に）がないか検討する

      const links: string[] = await page.evaluate(() => {
        const dataList: string[] = [];
        const nodeList: NodeListOf<HTMLBaseElement> =
          document.querySelectorAll('tr a');

        nodeList.forEach((_node) => {
          // 現在受付中ものの、リンクを取得する
          if (_node.innerText.indexOf('[受付中]') != -1) {
            const acceptedLinks: string = _node.href;
            dataList.push(acceptedLinks);
          }
        });
        return dataList;
      });

      // '受付中'の公演の数だけくり返す
      for (const link of links) {
        // 申込期間、当落確認期間、入金締切日のページ
        await page.goto(link);

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
        await Promise.all([
          page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }),
          await page.click(
            '#main > div.contents-body > div > p:nth-child(2) > a > img'
          ),
        ]);
        await sleep(1000);

        // イベントに紐づく公演の種類の数だけくり返す

        // const count: number = await page.evaluate(() => {
        //   const typeOfPerformance: any = document.querySelectorAll(
        //     'select[name="Event_ID"]'
        //   )[0];
        //   return typeOfPerformance.options.length;
        // });
        const count: number = await page.$eval(
          'select[name="Event_ID"]',
          (el: any) => el.length
        );

        console.log(count);

        for (let i = 1; i < count; i++) {
          // const typeOfPerformance: any = await page.evaluateHandle(() => {
          //   return Array.from(
          //     document.querySelectorAll('select[name="Event_ID"]')
          //   ).map((option) => option);
          // });
          await page.waitForSelector('select[name="Event_ID"] option');

          const child: number = i + 1;
          const title: string = await page.evaluate((child: number) => {
            const option: any = document.querySelector(
              '#main > div.contents-body > div > div > form > select > option:nth-child(' +
                child +
                ')'
            );
            return option.innerText;
          }, child);
          console.log('title', title);
          const eventId: string = await page.evaluate((child: number) => {
            const option: any = document.querySelector(
              '#main > div.contents-body > div > div > form > select > option:nth-child(' +
                child +
                ')'
            );
            return option.value;
          }, child);
          console.log('eventId', eventId);

          if (eventIds.includes(eventId)) {
            return;
          }

          // 公演を選択して、公演開催日のページへ
          const selectPerformance = await page.evaluate((i: number) => {
            const select: any = document.querySelectorAll(
              'select[name="Event_ID"]'
            )[0];
            select.options[i].selected = true;
          }, i);
          await selectPerformance;
          await Promise.all([
            page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }),
            await page.click('input[name="@Control_Name@"]'),
          ]);
          await sleep(1000);

          interface EventDetails {
            id: string;
            title: string;
            performanceDay: string;
            performer: string | null;
            venue: string;
            openingTime: string;
            showTime: string;
          }

          // 出演者を取得する
          const getPerformer: string | null = await page.evaluate(() => {
            const selector: NodeListOf<HTMLBaseElement> =
              document.querySelectorAll('.Note5');
            const text = selector[0].innerText;

            if (text.indexOf('出演：') != -1) {
              const start = text.indexOf('出演：') + 3;
              const end = text.substring(start).indexOf('\n');
              return text.substring(start).substring(0, end);
            }
            return null;
          });

          // 公演の数だけループして、公演の情報を取得する
          const eventDetails: EventDetails[] = await page.evaluate(
            (eventId: string, title: string, performer: string | null) => {
              const formEntry: NodeListOf<HTMLBaseElement> =
                document.querySelectorAll('form[name="form_Entry"]');
              const eventDetails = [];
              for (let i = 0; i < formEntry.length; i++) {
                const tableInfo: NodeListOf<HTMLBaseElement> =
                  formEntry[i].querySelectorAll('table tbody tr td');
                const performanceDay: string = tableInfo[2].innerText;
                const venue: string = tableInfo[3].innerText.replace('\n', ' ');
                const openingTime: string = tableInfo[4].innerText.replace(
                  '開場\n',
                  ''
                );
                const showTime: string = tableInfo[5].innerText.replace(
                  '開演\n',
                  ''
                );

                const eventDetail: EventDetails = {
                  id: eventId,
                  title: title,
                  performanceDay: performanceDay,
                  performer: performer,
                  venue: venue,
                  openingTime: openingTime,
                  showTime: showTime,
                };
                eventDetails.push(eventDetail);
              }
              return eventDetails;
            },
            eventId,
            title,
            getPerformer
          );

          interface Event {
            id: string;
            title: string;
            applicationPeriod: string;
            confirmPeriodForWinAndLose: string;
            depositDeadline: string;
            status: number;
          }

          const event: Event = {
            id: eventId,
            title: title,
            applicationPeriod: getApplicationPeriod,
            confirmPeriodForWinAndLose:
              getConfirmationPeriodForWinningAndLosing,
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
            .collection('hEvents')
            .doc(eventId);
          ticketInfoRef.set(event);

          eventDetails.map((detail, index) => {
            ticketInfoRef
              .collection('eventDetails')
              .doc(eventId + '-' + index)
              .set(detail)
              .then(function () {
                console.log(
                  'Document successfully written!',
                  ' eventId: ',
                  eventId
                );
              })
              .catch(function (error) {
                console.error(
                  'Error writing document: ',
                  ' eventId: ',
                  eventId,
                  error
                );
              });
          });
        }
      }
      await browser.close();
    })();
  });
