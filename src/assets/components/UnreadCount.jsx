import PropTypes from 'prop-types';
import  '../styles/unreadCount.css'

const UnreadCount = ({ unreadCount }) => {
    return (
        <div className="unread-count">
            {unreadCount > 0 && <span>{unreadCount} unread messages</span>}
        </div>
    );
};

UnreadCount.propTypes = {
    unreadCount: PropTypes.number.isRequired,
};

export default UnreadCount;
