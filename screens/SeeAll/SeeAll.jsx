import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fallbackMoviePoster,
  fetchMovieWithGenre,
  fetchTvSeries,
  image500,
} from "../../api/api";
import { Image } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import Loading from "../../Components/Loading/Loading";

const ios = Platform.OS == "ios";
const topMargin = ios ? "-mt-1" : "mt-2";
const SeeAll = () => {
  const { width, height } = Dimensions.get("window");
  const [movieData, setMovieData] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const { params } = useRoute();
  const getMovieWithGenre = async () => {
    const res = await fetchMovieWithGenre(params[2]);
    // console.log(res);
    if (res && res.results) setMovieData(res.results);
    setLoading(false);
    return res;
  };
  //   console.log(params[0]);
  useEffect(() => {
    console.log(params);
    if (params[1]) {
      setMovieData(params[1]);
      setLoading(false);
    } else {
      console.log("no Param");
      getMovieWithGenre();
    }
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-neutral-900 items-center">
      <View
        className={`z-20 w-full flex-row justify-between items-center px-4 top-4 mt-4 ${topMargin}`}
      >
        <TouchableOpacity
          className="rounded-xl p-1 bg-[#eab308]"
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={"28"} strokeWidth={2.5} color={"#fff"} />
        </TouchableOpacity>
        <Text className="text-[#eab308] text-2xl">{params[0]}</Text>
      </View>

      {loading ? (
        <Loading />
      ) : (
        <ScrollView className=" flex-1 w-full mt-10 ">
          <View className="flex-row justify-around flex-wrap">
            {movieData.map((item, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    navigation.push("Movie", item);
                  }}
                >
                  <View className="space-y-2 mb-4">
                    <Image
                      className="rounded-3xl"
                      source={{
                        uri: image500(item.poster_path) || fallbackMoviePoster,
                      }}
                      style={{ width: width * 0.44, height: height * 0.3 }}
                    />
                    <Text className="text-neutral-300 ml-1">
                      {item.title?.length > 20
                        ? item.title.slice(0, 20) + "..."
                        : item.title}
                      {item.name?.length > 20
                        ? item.name.slice(0, 20) + "..."
                        : item.name}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SeeAll;
