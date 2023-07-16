import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React from "react";
import { styles } from "../../themes";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { fallbackMoviePoster, image185 } from "../../api/api";

const MovieList = ({ title, data, seeAll = true }) => {
  const { width, height } = Dimensions.get("window");
  const movieName = "Aqua Man and Batman And Spuerman and Wonder Women";
  const navigation = useNavigation();

  return (
    <View className=" mb-8 mt-2 space-y-4">
      <View className=" mx-4 flex-row justify-between items-center">
        <Text className=" text-white text-xl">{title}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SeeAll", (params = [title, data]));
          }}
        >
          {seeAll && (
            <Text style={styles.text} className="text-lg">
              See All
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {/* Movie row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 15 }}
      >
        {data.slice(0, 10).map((item, index) => {
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => {
                navigation.push("Movie", item);
              }}
            >
              <View className=" space-y-1 mr-4">
                {/* <Image
                  // className=" w-1/3 h-1/5 rounded-3xl"
                  style={{ width: width * 0.33, height: height * 0.22 }}
                  className="rounded-3xl"
                  source={{
                    uri: image185(item.poster_path) || fallbackMoviePoster,
                  }}
                /> */}
                <Image
                  style={{ width: width * 0.33, height: height * 0.22 }}
                  className="rounded-3xl"
                  source={{
                    uri: image185(item.poster_path) || fallbackMoviePoster,
                  }}
                />
                <Text className=" text-neutral-300 ml-1">
                  {item.title.length > 14
                    ? item.title.slice(0, 14) + "..."
                    : item.title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MovieList;
