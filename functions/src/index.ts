import { sleep } from './utils/timer';
import { loginInfo, mLoginInfo } from './funclub-config';
const puppeteer = require('puppeteer');
// import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import firebase from 'firebase/app';
import { parseFromTimeZone } from 'date-fns-timezone';
import { tokenize } from './utils/text-processor';
// import * as fs from 'fs';
// import * as path from 'path';
// import { isToday, isAfter } from 'date-fns';
// import { getToday } from './utils/date';

admin.initializeApp();

export const events = functions
  .region('asia-northeast1')
  .runWith({
    timeoutSeconds: 120,
    memory: '2GB',
  })
  .pubsub.schedule('0,5 10,12,15-20 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
    const buildTokenMap = (...words: string[]) => {
      const tokenMap: { [k: string]: boolean } = {};

      tokenize(...words).forEach((token) => {
        tokenMap[token] = true;
      });

      return tokenMap;
    };

    const eventIds: string[] = [];
    await admin
      .firestore()
      .collection('hEvents')
      .where('isApplyEnded', '==', false)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          eventIds.push(doc.id);

          const isEnded = doc.data().applyEndDate.toDate() <= new Date();

          if (isEnded) {
            doc.ref.update({
              isApplyEnded: true,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        });
      });
    console.log('eventId: ', eventIds);

    await admin
      .firestore()
      .collection('hEvents')
      .where('isConfirmEnded', '==', false)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const isEnded = doc.data().confirmEndDate.toDate() <= new Date();

          if (isEnded) {
            doc.ref.update({
              isConfirmEnded: true,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        });
      });

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
      await sleep(1000);

      // 申込期間を取得する
      const getApplicationPeriod: string = await page.evaluate(() => {
        const tableInfo: NodeListOf<HTMLBaseElement> = document
          .querySelectorAll('table')[1]
          .querySelectorAll('tbody tr td');
        const tableText: string = tableInfo[0].innerText;
        const numberOfCharactersToTheFirstLineBreak: number =
          tableText.indexOf('\n', 0) - 1;
        const applicationPeriod: string = tableText.substr(
          1,
          numberOfCharactersToTheFirstLineBreak
        );
        return applicationPeriod;
      });

      // 申込開始日、終了日を取得する
      type ApplyPeriod = {
        applyStartDate: string;
        applyEndDate: string;
      };

      const getApplyPeriod: ApplyPeriod = await page.evaluate(
        (getApplicationPeriod: string) => {
          // TODO: 文字列操作を関数化して外だしする方法を調査する
          // 　⇛　evaluate内ではモジュールは使えない
          const applyPeriodText = getApplicationPeriod
            .replace(/[年月日時月火水木金土日まで]/g, '')
            .replaceAll('（）', '')
            .replace(/\s+/g, '');

          const start = applyPeriodText.substring(
            0,
            applyPeriodText.indexOf('～')
          );
          const startDateStr =
            start.substring(0, 4) +
            '-' +
            start.substring(4, 6) +
            '-' +
            start.substring(6, 8) +
            ' ' +
            start.substring(8, 10) +
            ':00:00';

          const end = applyPeriodText.substring(
            applyPeriodText.indexOf('～') + 1
          );
          const endDateStr =
            end.substring(0, 4) +
            '-' +
            end.substring(4, 6) +
            '-' +
            end.substring(6, 8) +
            ' ' +
            end.substring(8, 10) +
            ':00:00';

          const applyPeriod: ApplyPeriod = {
            applyStartDate: startDateStr,
            applyEndDate: endDateStr,
          };

          return applyPeriod;
        },
        getApplicationPeriod
      );

      const applyStartDate = parseFromTimeZone(getApplyPeriod.applyStartDate, {
        timeZone: 'Asia/Tokyo',
      });

      const applyEndDate = parseFromTimeZone(getApplyPeriod.applyEndDate, {
        timeZone: 'Asia/Tokyo',
      });

      // 当選落選確認期間を取得する
      const getConfirmationPeriod: string = await page.evaluate(() => {
        const tableInfo: NodeListOf<HTMLBaseElement> = document
          .querySelectorAll('table')[1]
          .querySelectorAll('tbody tr td');
        const tableText: string = tableInfo[1].innerText;
        const numberOfCharactersToTheFirstLineBreak: number = tableText.indexOf(
          '\n',
          0
        );
        const winningAndLosingPeriod: string = tableText.substr(
          0,
          numberOfCharactersToTheFirstLineBreak
        );
        return winningAndLosingPeriod;
      });

      // 当落確認開始日、終了日を取得する
      type ConfirmPeriod = {
        confirmStartDate: string;
        confirmEndDate: string;
      };

      const getConfirmPeriod: ConfirmPeriod = await page.evaluate(
        (getConfirmationPeriod: string) => {
          // TODO: 文字列操作を関数化して外だしする方法を調査する
          const confirmPeriodText = getConfirmationPeriod
            .replace(/[年月日時月火水木金土日まで]/g, '')
            .replaceAll('（）', '')
            .replace(/\s+/g, '');

          const start = confirmPeriodText.substring(
            0,
            confirmPeriodText.indexOf('～')
          );
          const startDateStr =
            start.substring(0, 4) +
            '-' +
            start.substring(4, 6) +
            '-' +
            start.substring(6, 8) +
            ' ' +
            start.substring(8, 10) +
            ':00:00';

          const end = confirmPeriodText.substring(
            confirmPeriodText.indexOf('～') + 1
          );
          const endDateStr =
            end.substring(0, 4) +
            '-' +
            end.substring(4, 6) +
            '-' +
            end.substring(6, 8) +
            ' ' +
            end.substring(8, 10) +
            ':00:00';

          const confirmPeriod: ConfirmPeriod = {
            confirmStartDate: startDateStr,
            confirmEndDate: endDateStr,
          };

          return confirmPeriod;
        },
        getConfirmationPeriod
      );

      const confirmStartDate = parseFromTimeZone(
        getConfirmPeriod.confirmStartDate,
        {
          timeZone: 'Asia/Tokyo',
        }
      );

      const confirmEndDate = parseFromTimeZone(
        getConfirmPeriod.confirmEndDate,
        {
          timeZone: 'Asia/Tokyo',
        }
      );

      // 入金締切日を取得する
      const getPaymentDate: string = await page.evaluate(() => {
        const tdSelector: NodeListOf<HTMLBaseElement> = document
          .querySelectorAll('table')[1]
          .querySelectorAll('tbody tr td');

        let tableText = '';
        if (tdSelector.length === 3) {
          tableText = '当日支払い';
        } else if (tdSelector.length === 4) {
          tableText = tdSelector[2].innerText;
        } else if (tdSelector.length === 5) {
          tableText = tdSelector[3].innerText;
        }
        const depositDeadline = tableText.replace(/\s+/g, '');

        return depositDeadline;
      });

      const getPayDate: string = await page.evaluate(
        (getPaymentDate: string) => {
          if (getPaymentDate === '当日支払い') {
            return '';
          }

          const paymentDateText = getPaymentDate
            .replace(/[年月日月火水木金土]/g, '')
            .replaceAll('（）', '');

          const paymentDateStr =
            paymentDateText.substring(0, 4) +
            '-' +
            paymentDateText.substring(4, 6) +
            '-' +
            paymentDateText.substring(6, 8) +
            ' ' +
            '00:00:00';

          return paymentDateStr;
        },
        getPaymentDate
      );

      const payDate =
        getPayDate !== ''
          ? parseFromTimeZone(getPayDate, {
              timeZone: 'Asia/Tokyo',
            })
          : null;

      // 公演選択のページ
      await Promise.all([
        page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }),
        await page.click(
          '#main > div.contents-body > div > p:nth-child(2) > a > img'
        ),
      ]);
      await sleep(1000);

      // イベントに紐づく公演の種類の数だけくり返す

      const count: number = await page.$eval(
        'select[name="Event_ID"]',
        (el: any) => el.length
      );

      for (let i = 1; i < count; i++) {
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

        if (eventIds.includes(eventId)) {
          continue;
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
          venue: string;
          openingTime: string;
          showTime: string;
          openText: string;
          showText: string;
          otherText: string | null;
          otherDetail: string | null;
          performer: string;
          performanceDate: firebase.firestore.Timestamp | null;
          tokenMap: { [token: string]: boolean } | null;
          createdAt: firebase.firestore.FieldValue | null;
          updatedAt: firebase.firestore.FieldValue | null;
        }

        // 出演者を取得する
        const getPerformer: string | null = await page.evaluate(() => {
          const selector = document.querySelector<HTMLElement>('.Note5');
          const text = selector!.innerText;

          if (text.indexOf('出演：') === -1) {
            return null;
          }

          const performText = text.substring(text.indexOf('出演：') + 3);
          const array = performText.split(/\r\n|\r|\n/);

          let performer = '';
          for (let i = 0; i < array.length; i++) {
            if (i === 0) {
              performer = array[0];
              continue;
            }
            if (
              !array[i].includes('MC：') &&
              (array[i].includes('/') ||
                array[i].includes('／') ||
                array[i].includes('・'))
            ) {
              performer = performer + array[i];
              continue;
            } else {
              break;
            }
          }

          return performer;
        });

        // MCを取得する
        const getMc: string | null = await page.evaluate(() => {
          const selector = document.querySelector<HTMLElement>('.Note5');
          const text = selector!.innerText;

          if (text.indexOf('MC：') != -1) {
            const start = text.indexOf('MC：') + 3;
            const end = text.substring(start).indexOf('\n');
            return text.substring(start).substring(0, end);
          }
          return null;
        });

        // 料金を取得する
        const getFee: string | null = await page.evaluate(() => {
          const selector = document.querySelector<HTMLElement>('.Note5');
          const text = selector!.innerText;

          if (text.indexOf('￥') != -1) {
            const startText = text.substring(text.indexOf('￥'));
            const fee = startText.substring(0, startText.indexOf('\n'));
            return fee;
          }
          return null;
        });

        // 公演の数だけループして、公演の情報を取得する
        const eventDetails: EventDetails[] = await page.evaluate(
          (eventId: string, title: string) => {
            const formEntry: NodeListOf<HTMLBaseElement> =
              document.querySelectorAll('form[name="form_Entry"]');
            const eventDetails = [];
            for (let i = 0; i < formEntry.length; i++) {
              const tableInfo: NodeListOf<HTMLBaseElement> =
                formEntry[i].querySelectorAll('table tbody tr td');
              const performanceDay: string = tableInfo[2].innerText;
              const venue: string = tableInfo[3].innerText.replace('\n', ' ');

              const openInnerText = tableInfo[4].innerText;
              const openText = openInnerText.substring(
                0,
                openInnerText.indexOf('\n')
              );

              const openingTime: string = openInnerText.substring(
                openInnerText.indexOf('\n') + 1
              );

              const showInnerText = tableInfo[5].innerText;
              const showText = showInnerText.substring(
                0,
                showInnerText.indexOf('\n')
              );

              const showTime: string = showInnerText.substring(
                showInnerText.indexOf('\n') + 1
              );

              let otherText = null;
              let otherDetail = null;
              if (tableInfo[6].innerText !== '\n') {
                const otherInnerText = tableInfo[6].innerText;
                otherText = otherInnerText.substring(
                  0,
                  otherInnerText.indexOf('\n')
                );
                otherDetail = otherInnerText.substring(
                  otherInnerText.indexOf('\n') + 1
                );
              }

              const array = tableInfo[7].innerText.split(/\r\n|\r|\n/);
              let performer = '';
              for (let i = 0; i < array.length; i++) {
                if (!array[0].includes('出演')) {
                  break;
                }
                if (i === 0) {
                  performer = array[0];
                  continue;
                }
                if (
                  array[i].includes('/') ||
                  array[i].includes('／') ||
                  array[i].includes('・')
                ) {
                  performer = performer + array[i];
                  continue;
                } else {
                  break;
                }
              }

              const isRegularTitle = title.substring(0, 1) !== '【';
              const eventDetail: EventDetails = {
                id: eventId,
                title: isRegularTitle
                  ? title
                  : title.substring(title.indexOf('】') + 1),
                performanceDay: performanceDay,
                venue: venue.includes('オンライン') ? 'オンライン' : venue,
                openingTime: openingTime,
                showTime: showTime,
                openText: openText,
                showText: showText,
                otherText: otherText,
                otherDetail: otherDetail,
                performer: performer,
                performanceDate: null,
                tokenMap: null,
                createdAt: null,
                updatedAt: null,
              };
              eventDetails.push(eventDetail);
            }
            return eventDetails;
          },
          eventId,
          title
        );

        interface Event {
          id: string;
          type: string;
          title: string;
          performer: string | null;
          mc: string | null;
          fee: string | null;
          isConfirmEnded: boolean;
          isApplyEnded: boolean;
          applyPeriodStr: string;
          confirmPeriodStr: string;
          paymentDateStr: string;
          applyStartDate: firebase.firestore.Timestamp | null;
          applyEndDate: firebase.firestore.Timestamp | null;
          confirmStartDate: firebase.firestore.Timestamp | null;
          confirmEndDate: firebase.firestore.Timestamp | null;
          paymentDate: firebase.firestore.Timestamp | null;
          createdAt: firebase.firestore.FieldValue | null;
          updatedAt: firebase.firestore.FieldValue | null;
        }

        const event: Event = {
          id: eventId,
          type: 'hello',
          title: title,
          performer: getPerformer,
          mc: getMc,
          fee: getFee,
          isConfirmEnded: false,
          isApplyEnded: false,
          applyPeriodStr: getApplicationPeriod,
          confirmPeriodStr: getConfirmationPeriod,
          paymentDateStr: getPaymentDate,
          applyStartDate: admin.firestore.Timestamp.fromDate(applyStartDate),
          applyEndDate: admin.firestore.Timestamp.fromDate(applyEndDate),
          confirmStartDate:
            admin.firestore.Timestamp.fromDate(confirmStartDate),
          confirmEndDate: admin.firestore.Timestamp.fromDate(confirmEndDate),
          paymentDate: payDate
            ? admin.firestore.Timestamp.fromDate(payDate)
            : payDate,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        console.log('タイトル： ', title);
        console.log('申込期間： ', getApplicationPeriod);
        console.log('当落確認期間： ', getConfirmationPeriod);
        console.log('入金締切日： ', getPaymentDate);

        const ticketInfoRef = admin
          .firestore()
          .collection('hEvents')
          .doc(eventId);
        ticketInfoRef.set(event);

        eventDetails.map((detail, index) => {
          const formatPerformDay = detail.performanceDay
            .replace('/', '-')
            .replace('/', '-')
            .replace(/[月火水木金土日]/g, '')
            .replace('()', '');
          const formatShowTime = detail.showTime + ':00';
          const performanceDate = formatPerformDay + ' ' + formatShowTime;

          const performanceDateStr = parseFromTimeZone(performanceDate, {
            timeZone: 'Asia/Tokyo',
          });
          detail.performanceDate =
            admin.firestore.Timestamp.fromDate(performanceDateStr);
          detail.createdAt = admin.firestore.FieldValue.serverTimestamp();
          detail.updatedAt = admin.firestore.FieldValue.serverTimestamp();

          detail.tokenMap =
            detail.performer !== ''
              ? buildTokenMap(detail.title, detail.venue, detail.performer)
              : buildTokenMap(detail.title, detail.venue);

          const detailCollectionName = admin
            .firestore()
            .collection('eventDetails');

          const docId = detailCollectionName.doc('H' + eventId + '-' + index);
          docId
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

    // M-line
    const mEventIds: string[] = [];

    await admin
      .firestore()
      .collection('mEvents')
      .where('isApplyEnded', '==', false)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          mEventIds.push(doc.id);

          const isEnded = doc.data().applyEndDate.toDate() <= new Date();

          if (isEnded) {
            doc.ref.update({
              isApplyEnded: true,
            });
          }
        });
      });
    console.log('eventId: ', mEventIds);

    await admin
      .firestore()
      .collection('mEvents')
      .where('isConfirmEnded', '==', false)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const isEnded = doc.data().confirmEndDate.toDate() <= new Date();

          if (isEnded) {
            doc.ref.update({
              isConfirmEnded: true,
            });
          }
        });
      });

    await page.goto('https://www.up-fc.jp/m-line/fanclub_Login.php');
    await page.type('input[name="User_No"]', mLoginInfo.userNo);
    await page.type('input[name="User_LoginPassword"]', mLoginInfo.password);
    await Promise.all([
      page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }),
      await page.click(
        '#container > div:nth-child(5) > div.form_box > div.form_box_bg > form > p:nth-child(5) > input[type=checkbox]'
      ),
      await page.click('input[name="@Control_Name@"]'),
    ]);
    await sleep(1000);

    await page.goto('https://www.up-fc.jp/m-line/fan_AllEventTour_List.php');
    await sleep(1000);

    const mLinks: string[] = await page.evaluate(() => {
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

    // // '受付中'の公演の数だけくり返す
    for (const link of mLinks) {
      // 申込期間、当落確認期間、入金締切日のページ
      await page.goto(link);
      await sleep(1000);

      // 申込期間を取得する
      const getApplicationPeriod: string = await page.evaluate(() => {
        const tableInfo: NodeListOf<HTMLBaseElement> = document
          .querySelectorAll('table')[1]
          .querySelectorAll('tbody tr td');
        const tableText: string = tableInfo[0].innerText;
        const numberOfCharactersToTheFirstLineBreak: number =
          tableText.indexOf('\n', 0) - 1;
        const applicationPeriod: string = tableText.substr(
          1,
          numberOfCharactersToTheFirstLineBreak
        );
        return applicationPeriod;
      });

      // 申込開始日、終了日を取得する
      type ApplyPeriod = {
        applyStartDate: string;
        applyEndDate: string;
      };

      const getApplyPeriod: ApplyPeriod = await page.evaluate(
        (getApplicationPeriod: string) => {
          // TODO: 文字列操作を関数化して外だしする方法を調査する
          // 　⇛　evaluate内ではモジュールは使えない
          const applyPeriodText = getApplicationPeriod
            .replace(/[年月日時月火水木金土日まで]/g, '')
            .replaceAll('（）', '')
            .replace(/\s+/g, '');

          const start = applyPeriodText.substring(
            0,
            applyPeriodText.indexOf('～')
          );
          const startDateStr =
            start.substring(0, 4) +
            '-' +
            start.substring(4, 6) +
            '-' +
            start.substring(6, 8) +
            ' ' +
            start.substring(8, 10) +
            ':00:00';

          const end = applyPeriodText.substring(
            applyPeriodText.indexOf('～') + 1
          );
          const endDateStr =
            end.substring(0, 4) +
            '-' +
            end.substring(4, 6) +
            '-' +
            end.substring(6, 8) +
            ' ' +
            end.substring(8, 10) +
            ':00:00';

          const applyPeriod: ApplyPeriod = {
            applyStartDate: startDateStr,
            applyEndDate: endDateStr,
          };

          return applyPeriod;
        },
        getApplicationPeriod
      );

      const applyStartDate = parseFromTimeZone(getApplyPeriod.applyStartDate, {
        timeZone: 'Asia/Tokyo',
      });

      const applyEndDate = parseFromTimeZone(getApplyPeriod.applyEndDate, {
        timeZone: 'Asia/Tokyo',
      });

      // 当選落選確認期間を取得する
      const getConfirmationPeriod: string = await page.evaluate(() => {
        const tableInfo: NodeListOf<HTMLBaseElement> = document
          .querySelectorAll('table')[1]
          .querySelectorAll('tbody tr td');
        const tableText: string = tableInfo[1].innerText;
        const numberOfCharactersToTheFirstLineBreak: number = tableText.indexOf(
          '\n',
          0
        );
        const winningAndLosingPeriod: string = tableText.substr(
          0,
          numberOfCharactersToTheFirstLineBreak
        );
        return winningAndLosingPeriod;
      });

      // 当落確認開始日、終了日を取得する
      type ConfirmPeriod = {
        confirmStartDate: string;
        confirmEndDate: string;
      };

      const getConfirmPeriod: ConfirmPeriod = await page.evaluate(
        (getConfirmationPeriod: string) => {
          // TODO: 文字列操作を関数化して外だしする方法を調査する
          const confirmPeriodText = getConfirmationPeriod
            .replace(/[年月日時月火水木金土日まで]/g, '')
            .replaceAll('（）', '')
            .replace(/\s+/g, '');

          const start = confirmPeriodText.substring(
            0,
            confirmPeriodText.indexOf('～')
          );
          const startDateStr =
            start.substring(0, 4) +
            '-' +
            start.substring(4, 6) +
            '-' +
            start.substring(6, 8) +
            ' ' +
            start.substring(8, 10) +
            ':00:00';

          const end = confirmPeriodText.substring(
            confirmPeriodText.indexOf('～') + 1
          );
          const endDateStr =
            end.substring(0, 4) +
            '-' +
            end.substring(4, 6) +
            '-' +
            end.substring(6, 8) +
            ' ' +
            end.substring(8, 10) +
            ':00:00';

          const confirmPeriod: ConfirmPeriod = {
            confirmStartDate: startDateStr,
            confirmEndDate: endDateStr,
          };

          return confirmPeriod;
        },
        getConfirmationPeriod
      );

      const confirmStartDate = parseFromTimeZone(
        getConfirmPeriod.confirmStartDate,
        {
          timeZone: 'Asia/Tokyo',
        }
      );

      const confirmEndDate = parseFromTimeZone(
        getConfirmPeriod.confirmEndDate,
        {
          timeZone: 'Asia/Tokyo',
        }
      );

      // 入金締切日を取得する
      const getPaymentDate: string = await page.evaluate(() => {
        const tdSelector: NodeListOf<HTMLBaseElement> = document
          .querySelectorAll('table')[1]
          .querySelectorAll('tbody tr td');

        let tableText = '';
        if (tdSelector.length === 3) {
          tableText = '当日支払い';
        } else if (tdSelector.length === 4) {
          tableText = tdSelector[2].innerText;
        } else if (tdSelector.length === 5) {
          tableText = tdSelector[3].innerText;
        }
        const depositDeadline = tableText.replace(/\s+/g, '');

        return depositDeadline;
      });

      const getPayDate: string = await page.evaluate(
        (getPaymentDate: string) => {
          if (getPaymentDate === '当日支払い') {
            return '';
          }

          const paymentDateText = getPaymentDate
            .replace(/[年月日月火水木金土]/g, '')
            .replaceAll('（）', '');

          const paymentDateStr =
            paymentDateText.substring(0, 4) +
            '-' +
            paymentDateText.substring(4, 6) +
            '-' +
            paymentDateText.substring(6, 8) +
            ' ' +
            '00:00:00';

          return paymentDateStr;
        },
        getPaymentDate
      );

      const payDate =
        getPayDate !== ''
          ? parseFromTimeZone(getPayDate, {
              timeZone: 'Asia/Tokyo',
            })
          : null;

      // 公演選択のページ
      await Promise.all([
        page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }),
        await page.click('#mainspace > div > p:nth-child(2) > a > img'),
      ]);
      await sleep(1000);

      // イベントに紐づく公演の種類の数だけくり返す

      const count: number = await page.$eval(
        'select[name="Event_ID"]',
        (el: any) => el.length
      );

      for (let i = 1; i < count; i++) {
        await page.waitForSelector('select[name="Event_ID"] option');

        const child: number = i + 1;
        const title: string = await page.evaluate((child: number) => {
          const option: any = document.querySelector(
            '#mainspace > div.contents-body > div > div:nth-child(1) > form > select > option:nth-child(' +
              child +
              ')'
          );

          return option.innerText;
        }, child);
        console.log('title', title);

        const eventId: string = await page.evaluate((child: number) => {
          const option: any = document.querySelector(
            '#mainspace > div.contents-body > div > div:nth-child(1) > form > select > option:nth-child(' +
              child +
              ')'
          );
          return option.value;
        }, child);

        if (mEventIds.includes(eventId)) {
          continue;
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
          page.waitForNavigation({
            waitUntil: ['load', 'networkidle2'],
          }),
          await page.click('input[name="@Control_Name@"]'),
        ]);
        await sleep(1000);

        interface EventDetails {
          id: string;
          title: string;
          performanceDay: string;
          venue: string;
          openingTime: string;
          showTime: string;
          openText: string;
          showText: string;
          otherText: string | null;
          otherDetail: string | null;
          performer: string;
          performanceDate: firebase.firestore.Timestamp | null;
          tokenMap: { [token: string]: boolean } | null;
          createdAt: firebase.firestore.FieldValue | null;
          updatedAt: firebase.firestore.FieldValue | null;
        }

        // 出演者を取得する
        const getPerformer: string | null = await page.evaluate(() => {
          const selector = document.querySelector<HTMLElement>('.Note5');
          const text = selector!.innerText;

          if (text.indexOf('出演：') === -1) {
            return null;
          }

          const performText = text.substring(text.indexOf('出演：') + 3);
          const array = performText.split(/\r\n|\r|\n/);

          let performer = '';
          for (let i = 0; i < array.length; i++) {
            if (i === 0) {
              performer = array[0];
              continue;
            }
            if (
              !array[i].includes('MC：') &&
              (array[i].includes('/') ||
                array[i].includes('／') ||
                array[i].includes('・'))
            ) {
              performer = performer + array[i];
              continue;
            } else {
              break;
            }
          }

          return performer;
        });

        // MCを取得する
        const getMc: string | null = await page.evaluate(() => {
          const selector = document.querySelector<HTMLElement>('.Note5');
          const text = selector!.innerText;

          if (text.indexOf('MC：') != -1) {
            const start = text.indexOf('MC：') + 3;
            const end = text.substring(start).indexOf('\n');
            return text.substring(start).substring(0, end);
          }
          return null;
        });

        // 料金を取得する
        const getFee: string | null = await page.evaluate(() => {
          const selector = document.querySelector<HTMLElement>('.Note5');
          const text = selector!.innerText;

          if (text.indexOf('￥') != -1) {
            const startText = text.substring(text.indexOf('￥'));
            const fee = startText.substring(0, startText.indexOf('\n'));
            return fee;
          }
          return null;
        });

        // 公演の数だけループして、公演の情報を取得する
        const eventDetails: EventDetails[] = await page.evaluate(
          (eventId: string, title: string) => {
            const formEntry: NodeListOf<HTMLBaseElement> =
              document.querySelectorAll('form[name="form_Entry"]');
            const eventDetails = [];
            for (let i = 0; i < formEntry.length; i++) {
              const tableInfo: NodeListOf<HTMLBaseElement> =
                formEntry[i].querySelectorAll('table tbody tr td');
              const performanceDay: string = tableInfo[2].innerText;
              const venue: string = tableInfo[3].innerText.replace('\n', ' ');

              const openInnerText = tableInfo[4].innerText;
              const openText = openInnerText.substring(
                0,
                openInnerText.indexOf('\n')
              );

              const openingTime: string = openInnerText.substring(
                openInnerText.indexOf('\n') + 1
              );

              const showInnerText = tableInfo[5].innerText;
              const showText = showInnerText.substring(
                0,
                showInnerText.indexOf('\n')
              );

              const showTime: string = showInnerText.substring(
                showInnerText.indexOf('\n') + 1
              );

              let otherText = null;
              let otherDetail = null;
              if (tableInfo[6].innerText !== '\n') {
                const otherInnerText = tableInfo[6].innerText;
                otherText = otherInnerText.substring(
                  0,
                  otherInnerText.indexOf('\n')
                );
                otherDetail = otherInnerText.substring(
                  otherInnerText.indexOf('\n') + 1
                );
              }

              const array = tableInfo[7].innerText.split(/\r\n|\r|\n/);
              let performer = '';
              for (let i = 0; i < array.length; i++) {
                if (!array[0].includes('出演')) {
                  break;
                }
                if (i === 0) {
                  performer = array[0];
                  continue;
                }
                if (
                  array[i].includes('/') ||
                  array[i].includes('／') ||
                  array[i].includes('・')
                ) {
                  performer = performer + array[i];
                  continue;
                } else {
                  break;
                }
              }

              const isRegularTitle = title.substring(0, 1) !== '【';
              const eventDetail: EventDetails = {
                id: eventId,
                title: isRegularTitle
                  ? title
                  : title.substring(title.indexOf('】') + 1),
                performanceDay: performanceDay,
                venue: venue.includes('オンライン') ? 'オンライン' : venue,
                openingTime: openingTime,
                showTime: showTime,
                openText: openText,
                showText: showText,
                otherText: otherText,
                otherDetail: otherDetail,
                performer: performer,
                performanceDate: null,
                tokenMap: null,
                createdAt: null,
                updatedAt: null,
              };
              eventDetails.push(eventDetail);
            }
            return eventDetails;
          },
          eventId,
          title
        );

        interface Event {
          id: string;
          type: string;
          title: string;
          performer: string | null;
          mc: string | null;
          fee: string | null;
          isConfirmEnded: boolean;
          isApplyEnded: boolean;
          applyPeriodStr: string;
          confirmPeriodStr: string;
          paymentDateStr: string;
          applyStartDate: firebase.firestore.Timestamp | null;
          applyEndDate: firebase.firestore.Timestamp | null;
          confirmStartDate: firebase.firestore.Timestamp | null;
          confirmEndDate: firebase.firestore.Timestamp | null;
          paymentDate: firebase.firestore.Timestamp | null;
          createdAt: firebase.firestore.FieldValue | null;
          updatedAt: firebase.firestore.FieldValue | null;
        }

        const event: Event = {
          id: eventId,
          type: 'mline',
          title: title,
          performer: getPerformer,
          mc: getMc,
          fee: getFee,
          isConfirmEnded: false,
          isApplyEnded: false,
          applyPeriodStr: getApplicationPeriod,
          confirmPeriodStr: getConfirmationPeriod,
          paymentDateStr: getPaymentDate,
          applyStartDate: admin.firestore.Timestamp.fromDate(applyStartDate),
          applyEndDate: admin.firestore.Timestamp.fromDate(applyEndDate),
          confirmStartDate:
            admin.firestore.Timestamp.fromDate(confirmStartDate),
          confirmEndDate: admin.firestore.Timestamp.fromDate(confirmEndDate),
          paymentDate: payDate
            ? admin.firestore.Timestamp.fromDate(payDate)
            : payDate,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        console.log('タイトル： ', title);
        console.log('申込期間： ', getApplicationPeriod);
        console.log('当落確認期間： ', getConfirmationPeriod);
        console.log('入金締切日： ', getPaymentDate);

        const ticketInfoRef = admin
          .firestore()
          .collection('mEvents')
          .doc(eventId);
        ticketInfoRef.set(event);

        const detailCollectionName = admin
          .firestore()
          .collection('eventDetails');

        eventDetails.map((detail, index) => {
          const formatPerformDay = detail.performanceDay
            .replace('/', '-')
            .replace('/', '-')
            .replace(/[月火水木金土日]/g, '')
            .replace('()', '');
          const formatShowTime = detail.showTime + ':00';
          const performanceDate = formatPerformDay + ' ' + formatShowTime;

          const performanceDateStr = parseFromTimeZone(performanceDate, {
            timeZone: 'Asia/Tokyo',
          });
          detail.performanceDate =
            admin.firestore.Timestamp.fromDate(performanceDateStr);
          detail.createdAt = admin.firestore.FieldValue.serverTimestamp();
          detail.updatedAt = admin.firestore.FieldValue.serverTimestamp();

          detail.tokenMap =
            detail.performer !== ''
              ? buildTokenMap(detail.title, detail.venue, detail.performer)
              : buildTokenMap(detail.title, detail.venue);

          const docId = detailCollectionName.doc('M' + eventId + '-' + index);
          docId
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
    interface EventDetails {
      docId: string;
      details: Details;
    }

    interface Details {
      id: string;
      title: string;
      performanceDay: string;
      venue: string;
      openingTime: string;
      showTime: string;
      openText: string;
      showText: string;
      otherText: string | null;
      otherDetail: string | null;
      performer: string;
      performanceDate: firebase.firestore.Timestamp | null;
      tokenMap: { [token: string]: boolean } | null;
      createdAt: firebase.firestore.FieldValue | null;
      updatedAt: firebase.firestore.FieldValue | null;
    }

    const eventDetails: EventDetails[] = [];
    await admin
      .firestore()
      .collection('eventDetails')
      .where('performanceDate', '<=', new Date())
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          const docId = doc.id;
          const details: Details = {
            id: doc.data().id,
            title: doc.data().title,
            performanceDay: doc.data().performanceDay,
            venue: doc.data().venue,
            openingTime: doc.data().openingTime,
            showTime: doc.data().showTime,
            openText: doc.data().openText,
            showText: doc.data().showText,
            otherText: doc.data().otherText,
            otherDetail: doc.data().otherDetail,
            performer: doc.data().performer,
            performanceDate: doc.data().performanceDate,
            tokenMap: doc.data().tokenMap,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
          };
          eventDetails.push({ docId, details });
        });
      });
    const detailCollectionName = admin
      .firestore()
      .collection('finishedEventDetails');
    const removeCollectionName = admin.firestore().collection('eventDetails');

    eventDetails.map((detail) => {
      const docId = detailCollectionName.doc(detail.docId);
      docId
        .set(detail.details)
        .then(function () {
          console.log(
            'Document successfully written!',
            ' eventId: ',
            detail.docId
          );

          removeCollectionName
            .doc(detail.docId)
            .delete()
            .then(async () => {
              console.log('Document successfully deleted!');
            })
            .catch((error) => {
              console.error('Error removing document: ', error);
            });
        })
        .catch(function (error) {
          console.error(
            'Error writing document: ',
            ' eventId: ',
            detail.docId,
            error
          );
        });
    });
    await browser.close();
  });

// export const updateStatus = functions
//   .region('asia-northeast1')
//   .runWith({
//     timeoutSeconds: 120,
//     memory: '2GB',
//   })
//   .pubsub.schedule('00 0 * * *')
//   .timeZone('Asia/Tokyo')
//   .onRun(async () => {
//     await admin
//       .firestore()
//       .collection('eventDetails')
//       .where('status', '==', 'wait')
//       .get()
//       .then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//           if (isToday(doc.data().performanceDate.toDate())) {
//             doc.ref.update({
//               status: 'start',
//               updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//             });
//           } else if (isAfter(getToday(), doc.data().performanceDate.toDate())) {
//             doc.ref.update({
//               status: 'end',
//               updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//             });
//           }
//         });
//       });
//   });

// export const updateText = functions
//   .region('asia-northeast1')
//   .https.onRequest(async (req, res) => {
//     const buildTokenMap = (...words: string[]) => {
//       const tokenMap: { [k: string]: boolean } = {};

//       tokenize(...words).forEach((token) => {
//         tokenMap[token] = true;
//       });

//       return tokenMap;
//     };
//     await admin
//       .firestore()
//       .collection('eventDetails')
//       .get()
//       .then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//           if (doc.data().id === '2335') {
//             const title = doc.data().title;
//             const venue = doc.data().venue;
//             const performer =
//               doc.data().performer === null ||
//               doc.data().performer === undefined
//                 ? ''
//                 : doc.data().performer;
//             let other = '';
//             if (doc.data().otherText === 'チーム「花」') {
//               other = 'hana';
//             } else if (doc.data().otherText === 'チーム「鳥」') {
//               other = 'tori';
//             } else if (doc.data().otherText === 'チーム「風」') {
//               other = 'kaze';
//             } else if (doc.data().otherText === 'チーム「月」') {
//               other = 'tsuki';
//             }

//             let eventPerformer = '';
//             if (doc.data().id === '1410') {
//               eventPerformer = '田中れいな';
//             } else if (doc.data().id === '1409') {
//               eventPerformer = '清水佐紀';
//             }

//             const tokenMap = buildTokenMap(
//               title,
//               venue,
//               performer,
//               eventPerformer,
//               other
//             );

//             doc.ref.update({
//               tokenMap: tokenMap,
//             });
//           }
//         });
//       });
//   });

// export const updateText = functions
//   .region('asia-northeast1')
//   .https.onRequest(async (req, res) => {
//     interface idAndTitle {
//       id: string;
//       title: string;
//     }

//     const hIdAndTitles: idAndTitle[] = [];
//     await admin
//       .firestore()
//       .collection('hEvents')
//       .get()
//       .then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//           // doc.data() is never undefined for query doc snapshots
//           const idAndTitle: idAndTitle = {
//             id: doc.data().id,
//             title: doc.data().title,
//           };

//           hIdAndTitles.push(idAndTitle);
//         });
//       });

//     const mIdAndTitles: idAndTitle[] = [];
//     await admin
//       .firestore()
//       .collection('mEvents')
//       .get()
//       .then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//           const idAndTitle: idAndTitle = {
//             id: doc.data().id,
//             title: doc.data().title,
//           };

//           mIdAndTitles.push(idAndTitle);
//         });
//       });

//     interface EventDetails {
//       id: string;
//       title: string;
//       performanceDay: string;
//       venue: string;
//       openingTime: string;
//       showTime: string;
//       openText: string;
//       showText: string;
//       otherText: string | null;
//       otherDetail: string | null;
//       performer: string | null;
//       performanceDate: firebase.firestore.Timestamp | null;
//       status: string;
//       createdAt: firebase.firestore.FieldValue | null;
//       updatedAt: firebase.firestore.FieldValue | null;
//     }

//     hIdAndTitles.forEach(async ({ id, title }) => {
//       await admin
//         .firestore()
//         .collection('hEvents')
//         .doc(id)
//         .collection('eventDetails')
//         .get()
//         .then(function (querySnapshot) {
//           // doc.data() is never undefined for query doc snapshots
//           querySnapshot.forEach(function (doc) {
//             const eventDetail: EventDetails = {
//               id: doc.data().id,
//               title: title,
//               performanceDay: doc.data().performanceDay,
//               venue: doc.data().venue,
//               openingTime: doc.data().openingTime,
//               showTime: doc.data().showTime,
//               openText: doc.data().openText,
//               showText: doc.data().showText,
//               otherText: doc.data().otherText ? doc.data().otherText : null,
//               otherDetail: doc.data().otherDetail
//                 ? doc.data().otherDetail
//                 : null,
//               performer: doc.data().performer ? doc.data().performer : null,
//               performanceDate: doc.data().performanceDate,
//               status: 'wait',
//               createdAt: doc.data().createdAt,
//               updatedAt: doc.data().updatedAt,
//             };

//             const eventInfoRef = admin
//               .firestore()
//               .collection('eventDetails')
//               .doc('H' + doc.id);
//             eventInfoRef.set(eventDetail);
//           });
//         });
//     });

//     mIdAndTitles.forEach(async ({ id, title }) => {
//       await admin
//         .firestore()
//         .collection('mEvents')
//         .doc(id)
//         .collection('eventDetails')
//         .get()
//         .then(function (querySnapshot) {
//           // doc.data() is never undefined for query doc snapshots
//           querySnapshot.forEach(function (doc) {
//             const eventDetail: EventDetails = {
//               id: doc.data().id,
//               title: title,
//               performanceDay: doc.data().performanceDay,
//               venue: doc.data().venue,
//               openingTime: doc.data().openingTime,
//               showTime: doc.data().showTime,
//               openText: doc.data().openText,
//               showText: doc.data().showText,
//               otherText: doc.data().otherText ? doc.data().otherText : null,
//               otherDetail: doc.data().otherDetail
//                 ? doc.data().otherDetail
//                 : null,
//               performer: doc.data().performer ? doc.data().performer : null,
//               performanceDate: doc.data().performanceDate,
//               status: 'wait',
//               createdAt: doc.data().createdAt,
//               updatedAt: doc.data().updatedAt,
//             };

//             const eventInfoRef = admin
//               .firestore()
//               .collection('eventDetails')
//               .doc('M' + doc.id);
//             eventInfoRef.set(eventDetail);
//           });
//         });
//     });
//   });

export const rewritesHtmlDetails = functions.https.onRequest(
  async (req, res) => {
    const domain = 'https://hellocale.com';
    const [, first, second, third] = req.path.split('/');
    const query = req.query;
    let title = '';
    let redirectPath = '';
    if (first === 'details') {
      const type = second === 'hello' ? 'hEvents' : 'mEvents';
      const doc = await admin.firestore().collection(type).doc(third).get();
      if (!doc.exists) {
        title = 'イベント詳細 | ハロカレ';
      } else {
        title = doc.data()!.title;
      }
      redirectPath = `/_${first}/${second}/${third}`;
    } else if (first === 'search') {
      title = '公演名・会場・都道府県で検索 | ハロカレ';
      redirectPath = `/_${first}?q=${query.q}`;
    } else if (first === 'peformances') {
      title = '公演一覧 | ハロカレ';
      redirectPath = `/_${first}`;
    }
    console.log(first, second, third);
    console.log(req.path);
    console.log(query);
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="https://hellocale.com/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="参加予定のハロプロの公演を、Googleカレンダーに登録できる！​チケット申込期間や入金締切日も確認できるハロー！プロジェクト非公式サイトです。"
    />
    <link rel="apple-touch-icon" href="https://hellocale.com/hellocale-logo192.png" />
    <link rel="manifest" href="https://hellocale.com/manifest.json" />
    <meta name="twitter:card" content="summary"></meta>
    <meta property="og:url" content="${domain}${req.path}"/>
    <meta property="og:title" content="${title}" />
    <meta
      property="og:description"
      content="参加予定のハロプロの公演を、Googleカレンダーに登録できる！​チケット申込期間や入金締切日も確認できるハロー！プロジェクト非公式サイトです。"
    />
    <meta
      property="twitter:image"
      content="https://hellocale.com/hellocale-logo192.png"
    /></head>
    <body><script type="text/javascript">window.location="${redirectPath}";</script></body></html>`;
    // +
    // '<meta property="og:description" content="{description}" />' +
    // `<meta property="og:image" content="https://www.example.com/user_icons/${uid}.png" />`;
    res.set('Cache-Control', 'public, max-age=600, s-maxage=600');
    res.status(200).end(html);
    return;
  }
);
