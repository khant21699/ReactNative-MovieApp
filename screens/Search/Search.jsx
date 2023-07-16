import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../Components/Loading/Loading";
import { fallbackMoviePoster, image500, searchMovies } from "../../api/api";
import { StatusBar } from "expo-status-bar";
const movieName = "Konosuba Legend Of Crimson";

const ios = Platform.OS == "ios";
const topMargin = ios ? 0 : 20;

const Search = () => {
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchinputRef = useRef();
  const movieName = "Konosuba Legend Of Crimson";

  const searchFun = (text) => {
    console.log(searchinputRef.current.input);
    // console.log(text);
    setLoading(true);
    searchMovies({
      query: text,
      include_adult: false,
      language: "en-US",
      page: "1",
    })
      .then((data) => {
        // console.log(data.results);
        if (data && data.results) setResults(data.results);
        else setResults([]);
        setLoading(false);
      })
      .catch((err) => {
        setResults([]);
        setLoading(false);
      });
  };
  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      {/* search Bar */}

      <View
        style={{
          zIndex: 100,
          marginHorizontal: 20,
          marginBottom: 1,
          flexDirection: "row",
          marginTop: topMargin,
          borderRadius: 9999,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#737373",
          marginBottom: 20,
        }}
        // className={`mx-4 mb-3 flex-row justify-center border border-neutral-500 rounded-full ${topMargin}`}
      >
        <TextInput
          ref={searchinputRef}
          onChangeText={searchFun}
          placeholder="Search Movie"
          placeholderTextColor={"lightgray"}
          className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
          keyboardAppearance="dark"
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home");
          }}
          className="rounded-full p-3 m-1 bg-neutral-500"
        >
          <XMarkIcon color={"white"} size={25} />
        </TouchableOpacity>
      </View>
      {/* result */}
      {loading ? (
        <Loading />
      ) : (
        <>
          {results.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              className="space-y-3"
            >
              <Text className="text-white ml-1 font-semibold">
                Results {results.length}
              </Text>
              <View className="flex-row justify-between flex-wrap">
                {results.map((item, index) => {
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
                            uri:
                              image500(item.poster_path) || fallbackMoviePoster,
                          }}
                          style={{ width: width * 0.44, height: height * 0.3 }}
                        />
                        <Text className="text-neutral-300 ml-1">
                          {item.title.length > 20
                            ? item.title.slice(0, 20) + "..."
                            : item.title}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            </ScrollView>
          ) : (
            <View className="flex-row justify-center">
              <Image
                source={{
                  uri: "https://cdni.iconscout.com/illustration/premium/thumb/people-watching-movie-in-theater-4991881-4159599.png",
                }}
                className="h-96 w-96"
              />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default Search;
