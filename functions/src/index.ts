import { sleep } from './utils/timer';
import { loginInfo, mLoginInfo } from './funclub-config';
const puppeteer = require('puppeteer');
// import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import firebase from 'firebase/app';
import { parseFromTimeZone } from 'date-fns-timezone';

admin.initializeApp();

export const events = functions
  .region('asia-northeast1')
  .runWith({
    timeoutSeconds: 120,
    memory: '2GB',
  })
  .pubsub.schedule('0,5,55 10,12,15-20 * * 1-5')
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
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
          performanceDay: string;
          venue: string;
          openingTime: string;
          showTime: string;
          openText: string;
          showText: string;
          otherText: string | null;
          otherDetail: string | null;
          performer: string | null;
          performanceDate: firebase.firestore.Timestamp | null;
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

        // 公演の数だけループして、公演の情報を取得する
        const eventDetails: EventDetails[] = await page.evaluate(
          (eventId: string) => {
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
              let performer = null;
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

              const eventDetail: EventDetails = {
                id: eventId,
                performanceDay: performanceDay,
                venue: venue,
                openingTime: openingTime,
                showTime: showTime,
                openText: openText,
                showText: showText,
                otherText: otherText,
                otherDetail: otherDetail,
                performer: performer,
                performanceDate: null,
                createdAt: null,
                updatedAt: null,
              };
              eventDetails.push(eventDetail);
            }
            return eventDetails;
          },
          eventId
        );

        interface Event {
          id: string;
          type: string;
          title: string;
          performer: string | null;
          mc: string | null;
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
          performanceDay: string;
          venue: string;
          openingTime: string;
          showTime: string;
          openText: string;
          showText: string;
          otherText: string | null;
          otherDetail: string | null;
          performer: string | null;
          performanceDate: firebase.firestore.Timestamp | null;
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

        // 公演の数だけループして、公演の情報を取得する
        const eventDetails: EventDetails[] = await page.evaluate(
          (eventId: string) => {
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
              let performer = null;
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

              const eventDetail: EventDetails = {
                id: eventId,
                performanceDay: performanceDay,
                venue: venue,
                openingTime: openingTime,
                showTime: showTime,
                openText: openText,
                showText: showText,
                otherText: otherText,
                otherDetail: otherDetail,
                performer: performer,
                performanceDate: null,
                createdAt: null,
                updatedAt: null,
              };
              eventDetails.push(eventDetail);
            }
            return eventDetails;
          },
          eventId
        );

        interface Event {
          id: string;
          type: string;
          title: string;
          performer: string | null;
          mc: string | null;
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
  });

// export const updateText = functions
//   .region('asia-northeast1')
//   .https.onRequest(async (req, res) => {
//     const eventIds: string[] = [];
//     await admin
//       .firestore()
//       .collection('hEvents')
//       .get()
//       .then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//           // doc.data() is never undefined for query doc snapshots

//           eventIds.push(doc.id);
//         });
//       });
//     eventIds.forEach(async (id) => {
//       await admin
//         .firestore()
//         .collection('hEvents')
//         .doc(id)
//         .collection('eventDetails')
//         .get()
//         .then(function (querySnapshot) {
//           // doc.data() is never undefined for query doc snapshots
//           querySnapshot.forEach(function (doc) {
//             doc.ref.set(
//               { openText: '開場', showText: '開演' },
//               { merge: true }
//             );
//           });
//         });
//     });

//     const mEventIds: string[] = [];
//     await admin
//       .firestore()
//       .collection('mEvents')
//       .get()
//       .then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//           // doc.data() is never undefined for query doc snapshots

//           mEventIds.push(doc.id);
//         });
//       });
//     eventIds.forEach(async (id) => {
//       await admin
//         .firestore()
//         .collection('mEvents')
//         .doc(id)
//         .collection('eventDetails')
//         .get()
//         .then(function (querySnapshot) {
//           // doc.data() is never undefined for query doc snapshots
//           querySnapshot.forEach(function (doc) {
//             doc.ref.set(
//               { openText: '開場', showText: '開演' },
//               { merge: true }
//             );
//           });
//         });
//     });
//   });