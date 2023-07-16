import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  useAnimatedValue,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/solid";
import { TouchableOpacity } from "react-native";
import { styles } from "../../themes";
import { ScrollView } from "react-native";
import TrendingMovies from "../../Components/TrendingMovies/TrendingMovies";
import MovieList from "../../Components/MovieList/MovieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../Components/Loading/Loading";
import {
  fetchGenres,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchTvSeries,
  fetchUpcomingMovies,
  genreEndpoint,
} from "../../api/api";
import axios from "axios";
const ios = Platform.OS == "ios";
const botMargin = ios ? -2 : 20;
const topMargin = ios ? 0 : 20;
const HomeScreen = () => {
  const { width, height } = Dimensions.get("window");

  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState(false);
  const [genres, setGenres] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const getTrending = async () => {
    const res = await fetchTrendingMovies();
    // console.log(res);
    return res;
  };
  const getUpcoming = async () => {
    const res = await fetchUpcomingMovies();
    // console.log(res);
    return res;
  };
  const getTopRated = async () => {
    const res = await fetchTopRatedMovies();
    // console.log(res);
    return res;
  };
  const startAni = () => {
    if (nav) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: -width,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };
  useEffect(() => {
    startAni();
  }, [nav]);
  const fetchGenres = async () => {
    console.log(genreEndpoint);
    try {
      const response = await axios.get(genreEndpoint);
      if (response && response.data && response.data.genres) {
        return response.data.genres;
      } else {
        throw new Error("Failed to fetch genres.");
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getTrending(),
      getUpcoming(),
      getTopRated(),
      fetchGenres(),
    ]).then((res) => {
      console.log(res[3]);
      if (res[0] && res[0].results) setTrending(res[0].results);
      if (res[1] && res[1].results) setUpcoming(res[1].results);
      if (res[2] && res[2].results) setTopRated(res[2].results);
      if (res[3]) setGenres(res[3]);
      setLoading(false);
    });
    StatusBar.setBackgroundColor("transparent")
    StatusBar.setBarStyle("light-content")
  }, []);
  return (
    <>
      <View style={{ backgroundColor: "#171717", flex: 1 }}>
        {/* nav and logo */}
        <SafeAreaView style={{ marginBottom: botMargin, marginTop: topMargin }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 20,
            }}
            //  className=" flex-row justify-between items-center mx-4"
          >
            <TouchableOpacity
              onPress={() => {
                setNav(true);
              }}
            >
              <Bars3CenterLeftIcon
                color={"white"}
                strokeWidth={2}
                size={"30"}
              />
            </TouchableOpacity>
            <Text className=" text-white text-3xl font-bold">
              <Text style={styles.text}>M</Text>ovies
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Search");
              }}
            >
              <MagnifyingGlassIcon size={"30"} strokeWidth={2} color={"#fff"} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        {/* nav and logo end*/}
        {loading ? (
          <Loading />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {/* trending movies carousel */}
            {TrendingMovies && TrendingMovies.length > 0 && (
              <TrendingMovies data={trending} />
            )}
            {/* trending movies carousel end */}
            {/* Upcoming start */}
            <MovieList title="Upcoming" data={upcoming} />
            {/* upcoming End */}
            {/* Toprated start */}
            <MovieList title="Top Rated" data={topRated} />
            {/* Toprated End */}
          </ScrollView>
        )}
      </View>
      <Animated.View
        style={[{ transform: [{ translateX: fadeAnim }] }]}
        className={`flex-row absolute top-0  h-full w-full  z-10 transition-all `}
      >
        <ScrollView className="w-2/3 h-full  bg-neutral-900">
          <SafeAreaView className=" w-full h-full  flex items-center justify-center px-5">
            <Text className="text-2xl text-white mt-2">Genres</Text>

            {genres.map((item) => {
              return (
                <TouchableOpacity
                  className="border-b w-full flex items-center border-neutral-100 mt-5 p-3 mx-5 bg-neutral-900"
                  onPress={() => {
                    setNav(false);
                    navigation.navigate("SeeAll", [item.name, null, item.id]);
                  }}
                >
                  <Text className="text-xl text-white">{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </SafeAreaView>
        </ScrollView>
        <View className="w-1/3 h-full  bg-transparent">
          <TouchableWithoutFeedback
            className="h-full w-full"
            onPress={() => {
              setNav(false);
            }}
          >
            <View className="h-full w-full"></View>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    </>
  );
};

export default HomeScreen;
