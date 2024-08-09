"use client";
import { useEffect } from "react";

const SaveDeviceIdLocalstorage = () => {
  function handleLocalStorageSave() {
    if (typeof window !== "undefined" && window.localStorage) {
      const existingDeviceId = localStorage.getItem("deviceId");
      if (!existingDeviceId) {
        const navigatorInfo = `${navigator.userAgent}${navigator.language}${navigator.platform}`;
        const hash = btoa(navigatorInfo);
        localStorage.setItem("deviceId", hash);
      }
    }
  }
  useEffect(() => {
    handleLocalStorageSave();
  }, []);
  return null;
};

export default SaveDeviceIdLocalstorage;
