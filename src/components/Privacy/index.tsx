import { Container, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { Link } from "react-router-dom";

const Privacy: FC = () => (
  <Container fixed>
    <br />
    <Typography variant="h6">
      <strong>プライバシーポリシー</strong>
    </Typography>
    <Typography variant="body2">
      ハロカレ（以下「当方」といいます。）は、当方の提供するサービス（以下「本サービス」といいます。）における、お客様についての個人情報を含む利用者情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
    </Typography>
    <br />
    <Typography variant="body2">
      <strong>1.収集する情報</strong>
    </Typography>
    <Typography variant="body2">
      当方の提供する本サービスでは、利用状況解析のためにGoogle Firebase
      Analyticsを使用する場合がございます。
      <br />
      取得する情報、利用目的、第三者への提供等の詳細につきましては、以下のプライバシーポリシーのリンクよりご確認ください。
      <br />
      <Link to="https://policies.google.com/privacy">
        Firebase Analytics（Google Inc.）
      </Link>
    </Typography>
    <br />
    <Typography variant="body2">
      <strong>2.外部サービスのAPIから取得した情報の用途について</strong>
    </Typography>
    <Typography variant="body2">
      Google（
      <Link to="https://policies.google.com/privacy">プライバシーポリシー</Link>
      ）<br />
      &nbsp;Google Calendar API
      <br />
      （scope: https://www.googleapis.com/auth/calendar.events）
      <br />
      &nbsp;・イベント情報のカレンダー追加機能で利用しています
      <br />
      &nbsp;・イベント情報をカレンダーに追加する以外の用途では利用しません
    </Typography>
    <br />
    <Typography variant="body2">
      <strong>3.お問い合わせ先</strong>
    </Typography>
    <Typography variant="body2">
      <Link to="https://twitter.com/ssk_hk">https://twitter.com/ssk_hk</Link>
    </Typography>
  </Container>
);

export default Privacy;
