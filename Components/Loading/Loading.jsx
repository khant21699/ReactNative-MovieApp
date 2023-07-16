import { View, Text, Dimensions, Image } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import { theme } from "../../themes";
import LoadingGif from "../../assets/LoadingGif.gif";
const Loading = () => {
  const { width, height } = Dimensions.get("window");
  return (
    <View
      style={{
        width: width,
        height: height,
        position: "absolute",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#171717",
      }}
      // className="absolute flex-row justify-center items-center"
    >
      <Image source={LoadingGif} style={{ width: 100, height: 100 }} />
    </View>
  );
};

export default Loading;
