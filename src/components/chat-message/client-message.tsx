import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PersonIcon from '../../static/person.svg';
import Linkifier from './linkifier';
import MarkingOptions from './marking-options';
import { useAppSelector } from '../../store';
import { TRAINING_TABS } from '../../utils/constants';

const rightAnimation = {
  animate: { opacity: 1, x: 0 },
  initial: { opacity: 0, x: 20 },
  transition: { duration: 0.25, delay: 0.25 },
};

const ClientMessage = (props: { message: string }): JSX.Element => {
  const { message } = props;
  const [showMarkingOptionsModal, setShowMarkingOptionsModal] = useState(false);
  const activeTab = useAppSelector((state) => state.training.activeTab);

  return (
    <motion.div animate={rightAnimation.animate} initial={rightAnimation.initial} transition={rightAnimation.transition}>
      {showMarkingOptionsModal && <MarkingOptions message={message} setShowMarkingOptionsModal={(e: boolean) => setShowMarkingOptionsModal(e)} />}
      {activeTab === TRAINING_TABS.ARCHIVE ? (
        <div className="message client">
          <div className="icon">
            <img src={PersonIcon} alt="Person icon" />
          </div>
          <button className={showMarkingOptionsModal ? 'content selected' : 'content training'} onClick={() => setShowMarkingOptionsModal(true)} type="button">
            <Linkifier message={message} />
          </button>
        </div>
      ) : (
        <div className="message client">
          <div className="icon">
            <img src={PersonIcon} alt="Person icon" />
          </div>
          <div className="content">
            <Linkifier message={message} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ClientMessage;
