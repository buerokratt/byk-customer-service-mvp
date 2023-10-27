import React from 'react';
import styled from 'styled-components';
import IntentExampleListItem from './intent-example-list-item';

const IntentExampleList = (props: { examples: string[] }): JSX.Element => {
  const { examples } = props;

  return (
    <IntentExampleListStyles>
      <div className="examples-box">
        {examples.map((example) => (
          <IntentExampleListItem key={example} example={example} />
        ))}
      </div>
    </IntentExampleListStyles>
  );
};

const IntentExampleListStyles = styled.div`
  overflow: auto;

  .examples-box {
    margin: 1rem;
  }
`;

export default IntentExampleList;
