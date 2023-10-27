import { motion } from 'framer-motion';
import React from 'react';
import { ReactComponent as RobotIcon } from '../../static/buerokratt.svg';
import Linkifier from './linkifier';

const leftAnimation = {
  animate: { opacity: 1, x: 0 },
  initial: { opacity: 0, x: -20 },
  transition: { duration: 0.25, delay: 0.25 },
};

const AdminMessage = (props: { message: string }): JSX.Element => {
  const { message } = props;

  return (
    <motion.div animate={leftAnimation.animate} initial={leftAnimation.initial} transition={leftAnimation.transition}>
      <div className="message admin">
        {/* TODO: Fix when we can get name from TARA */}
        {/* {clientNameEnabled && <div className={styles.name}>{client}</div>} */}
        <div className="icon">
          <RobotIcon />
        </div>
        <div className="content">
          <Linkifier message={message} />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminMessage;
