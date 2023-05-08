import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { media } from 'styles/media';
import axios from 'axios';

import 'primereact/resources/themes/md-dark-deeppurple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { BsSearch } from 'react-icons/bs';

import { Grid } from 'app/components/Loading/Grid';
import { Query } from 'app/components/Result/Query';

const genQuery = async (input: string, dialect: any) => {
  console.log(input, dialect);
  const response = await axios.post(
    'https://speaql.com/callout',
    {
      prompt: input,
      dialect: dialect.name || 'MySQL',
      user: 'amaze',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
  return response.data;
};

const SearchBar = styled.div`
  width: 100%;
  padding: 0 1rem;
  .searchInput,
  .searchButton {
    text-overflow: ellipsis;
    padding: 0.5rem;
    font-size: 1rem;
  }
  ${media.small} {
    width: max(30rem, 80%);
    .searchInput,
    .searchButton {
      padding: 0.8rem;
      font-size: 1.1rem;
    }
  }
  ${media.medium} {
    max-width: 50rem;
    .searchInput,
    .searchButton {
      padding: 0.8rem;
      font-size: 1.2rem;
    }
  }
`;

export function SearchPage() {
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const dialects = [
    { name: 'Aurora MySQL', code: 'Aurora MySQL' },
    { name: 'Aurora PostgreSQL', code: 'Aurora PostgreSQL' },
    { name: 'Cassandra', code: 'Cassandra' },
    { name: 'CockroachDB', code: 'CockroachDB' },
    { name: 'DB2', code: 'DB2' },
    { name: 'Django ORM', code: 'Django ORM' },
    { name: 'DynamoDB', code: 'DynamoDB' },
    { name: 'Elasticsearch', code: 'Elasticsearch' },
    { name: 'Firestore', code: 'Firestore' },
    { name: 'Hive', code: 'Hive' },
    { name: 'Impala', code: 'Impala' },
    { name: 'MariaDB', code: 'MariaDB' },
    { name: 'MongoDB', code: 'MongoDB' },
    { name: 'MySQL', code: 'MySQL' },
    { name: 'Oracle', code: 'Oracle' },
    { name: 'PostgreSQL', code: 'PostgreSQL' },
    { name: 'Presto', code: 'Presto' },
    { name: 'Redshift', code: 'Redshift' },
    { name: 'Snowflake', code: 'Snowflake' },
    { name: 'SQL Server', code: 'SQL Server' },
    { name: 'SQLite', code: 'SQLite' },
    { name: 'Sybase', code: 'Sybase' },
    { name: 'Teradata', code: 'Teradata' },
    { name: 'Vertica', code: 'Vertica' },
    { name: 'VoltDB', code: 'VoltDB' },
  ];

  const [dialect, setDialect] = React.useState(dialects[0]);
  const selectedDialect = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const dialectOptionTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Search</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <SearchBar className="mx-auto m-5 mb-0">
        <form
          className="p-inputgroup"
          onSubmit={e => {
            e.preventDefault();
            setLoading(true);
            genQuery(search, dialect).then(res => {
              setLoading(false);
              setResult(res);
            });
          }}
        >
          <InputText
            placeholder="What's the total number of users by state?"
            className="searchInput"
            required
            onChange={e => {
              setSearch(e.currentTarget.value);
            }}
          />
          <Button
            type="submit"
            aria-label="Search"
            className="searchButton"
            icon={<BsSearch />}
            style={{ zIndex: 5 }}
          />
        </form>
        <Dropdown
          value={dialect}
          onChange={e => {
            if (e.value != dialect) {
              setDialect(e.value);
            }
          }}
          options={dialects}
          optionLabel="dialect"
          placeholder="Select a Query Language"
          required
          valueTemplate={selectedDialect}
          itemTemplate={dialectOptionTemplate}
          className="w-20rem m-1 dialectSelect"
        />
      </SearchBar>
      {loading && <Grid />}
      {!loading && result && <Query result={result} />}
    </>
  );
}
