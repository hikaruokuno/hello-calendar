import React, { FC } from "react";

import SearchMainContainer from "containers/Search/SearchMain";
import { Helmet } from "react-helmet";
import { titleName } from "constants/constants";

const Search: FC = () => (
  <>
    <Helmet>
      <title>
        {titleName.search} | {titleName.main}
      </title>
    </Helmet>
    <SearchMainContainer />
  </>
);

export default Search;
