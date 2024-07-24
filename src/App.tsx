import { useState } from "react";
import "./App.css";
import { AnimatePresence, motion, useAnimate } from "framer-motion";

import { serializeError } from "serialize-error";

const useApp = () => {
  const [screen, setScreen] = useState<
    "idle" | "onboard" | "permissions" | "add-to-home" | "app"
  >("onboard");

  return {
    screen,
    setScreen,
  };
};

type UseApp = ReturnType<typeof useApp>;

function Layout(props: { style: any; children: any }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
}

function Button(props: { onClick: () => void; children: any }) {
  return (
    <motion.button
      onClick={props.onClick}
      style={{
        padding: "10px 20px",
        borderRadius: 5,
        backgroundColor: "blue",
        color: "white",
        border: "none",
        cursor: "pointer",
        width: "100%",
      }}
      variants={item}
    >
      {props.children}
    </motion.button>
  );
}

function delayNotification() {
  if (Notification.permission === "granted") {
    setTimeout(function () {
      navigator.serviceWorker.getRegistration().then(function (registration) {
        if (registration)
          registration.showNotification("Hello, World!", {
            body: "This is a test notification.",
            icon: "/icon-192x192.png",
          });
      });
    }, 5000);
  }
}

function AddToHomeScreen(props: UseApp) {
  const { setScreen } = props;

  return (
    <div>
      <h2>Install the app</h2>
      <p>Click the button below to install the app on your device</p>
      <Button onClick={() => setScreen("app")}>Install</Button>
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1, y: 10 },
};

function Onboard(props: UseApp) {
  const { setScreen } = props;

  return (
    <Layout style={{}}>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.h2 variants={item}>Welcome to the app</motion.h2>
        {/* <motion.p variants={item}>Let's set you up</motion.p> */}
        <Button onClick={() => setScreen("permissions")}>
          Set up My Account
        </Button>
      </motion.div>
    </Layout>
  );
}

function Permissions(props: UseApp) {
  const { setScreen } = props;

  function requestNotificationPermission() {
    if ("Notification" in window && navigator.serviceWorker) {
      console.info("called");
      Notification.requestPermission()
        .then(function (permission) {
          if (permission === "granted") {
            console.log("Notification permission granted.");
            setScreen("add-to-home");
            // Now you can show notifications
          } else {
            alert("Notification permission denied.");
          }
        })
        .catch(function (error) {
          console.info(error, error);
          alert(
            "Error requesting notification permission:" + serializeError(error)
          );
        });
    } else {
      alert("Notifications are not supported by your browser.");
    }
  }

  return (
    <Layout style={{}}>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.h2 variants={item}>Permissions</motion.h2>
        <motion.p variants={item}>Let's set you up</motion.p>
        <Button onClick={() => requestNotificationPermission()}>
          Set up My Account
        </Button>
      </motion.div>
    </Layout>
  );
}

const Idle = () => {
  return <h2>Loading...</h2>;
};

function App() {
  const app = useApp();

  return (
    <div
      style={{
        boxSizing: "border-box",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <AnimatePresence>
        {app.screen === "idle" && <Idle />}
        {app.screen === "onboard" && <Onboard {...app} />}
        {app.screen === "permissions" && <Permissions {...app} />}
        {app.screen === "add-to-home" && <AddToHomeScreen {...app} />}
        {app.screen === "app" && <h2>App</h2>}
      </AnimatePresence>
    </div>
  );
}

export default App;
