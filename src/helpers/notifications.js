import NotificationPopup from "../components/NotificationPopups/NotificationPopup";
import ReactDOM from "react-dom";

export function notificationPopup(msg, type, onClose) {
    // Create a new div element to render the notification
    const notificationContainer = document.createElement("div");
    document.body.appendChild(notificationContainer);
  
    const closeNotification = () => {
      ReactDOM.unmountComponentAtNode(notificationContainer);
      notificationContainer.remove();
      if(onClose){
        onClose();}
    };
  
    ReactDOM.render(
      <NotificationPopup message={msg} type={type} onClose={closeNotification} />,
      notificationContainer
    );
}

export default notificationPopup
  
  
  
 
  
  