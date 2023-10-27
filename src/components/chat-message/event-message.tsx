import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const leftAnimation = {
  animate: { opacity: 1, x: 0 },
  initial: { opacity: 0, x: -20 },
  transition: { duration: 0.25, delay: 0.25 },
};

const EventMessage = (props: { message: string }): JSX.Element => {
  const { message } = props;
  return (
    <EventMessageStyles>
      <motion.div animate={leftAnimation.animate} initial={leftAnimation.initial} transition={leftAnimation.transition}>
        <div className="message event">{message}</div>
      </motion.div>
    </EventMessageStyles>
  );
};

const EventMessageStyles = styled.div`
  .message {
    margin: 0.4em 0;
    padding: 0.5rem 0;
    &.event {
      background-color: #f0f1f2;
      text-align: center;
      color: #575a5d;
      border-radius: 6px;
      max-width: 50%;
      margin: 0.5rem auto;
    }
  }
`;

export default EventMessage;
