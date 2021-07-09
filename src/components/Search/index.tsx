import React, { FC } from "react";

import SearchMainContainer from "containers/Search/SearchMain";
import { Helmet } from "react-helmet";

const Search: FC = () => (
  <>
    <Helmet>
      <title>公演名・会場・都道府県で検索 | ハロカレ</title>
    </Helmet>
    <SearchMainContainer />
  </>
);

export default Search;
