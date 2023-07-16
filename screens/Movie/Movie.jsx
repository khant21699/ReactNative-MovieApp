import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/solid";
import { styles, theme } from "../../themes";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../../Components/Cast/Cast";
import MovieList from "../../Components/MovieList/MovieList";
import Loading from "../../Components/Loading/Loading";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
} from "../../api/api";

const ios = Platform.OS == "ios";
const topMargin = ios ? "" : "mt-3";

const Movie = () => {
  const movieName = "Aqua Man and Batman And Spuerman and Wonder Women";

  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const { params: item } = useRoute();
  const [isFavourite, toggleFavourite] = useState(false);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieDetail, setMovieDetail] = useState({});
  const [nav, setNav] = useState(false);

  const getMovieDetail = async () => {
    const res = await fetchMovieDetails(item.id);
    // console.log(res);
    return res;
  };
  const getMovieCredit = async () => {
    const res = await fetchMovieCredits(item.id);
    // console.log(res);
    return res;
  };
  const getSimilarMovies = async () => {
    const res = await fetchSimilarMovies(item.id);
    // console.log(res);
    return res;
  };

  useEffect(() => {
    console.log(item);
    setLoading(true);
    Promise.all([getMovieDetail(), getMovieCredit(), getSimilarMovies()]).then(
      (res) => {
        // console.log(res[0]);
        // console.log(res[1].cast);
        // console.log(res[2].results);
        // setMovieDetail(res[0].results);
        if (res[0] !== undefined) setMovieDetail(res[0]);
        if (res[1] && res[1].cast) setCast(res[1].cast);
        if (res[2] && res[2].results) setSimilarMovies(res[2].results);
        setLoading(false);
      }
    );
  }, [item]);
  return (
    <View style={{ flex: 1, backgroundColor: "#171717" }}>
      <View className="w-full">
        <SafeAreaView
          className={`absolute z-20 w-full flex-row justify-between items-center px-4 top-4 ${topMargin}`}
        >
          <TouchableOpacity
            className="rounded-xl p-1 bg-[#eab308]"
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size={"28"} strokeWidth={2.5} color={"#fff"} />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
            <HeartIcon
              size={35}
              color={isFavourite ? theme.background : "#fff"}
            />
          </TouchableOpacity> */}
        </SafeAreaView>

        {loading ? (
          <Loading />
        ) : (
          <ScrollView>
            <>
              <View>
                <Image
                  style={{ width: width, height: height * 0.55 }}
                  source={{
                    uri:
                      image500(movieDetail.poster_path) || fallbackMoviePoster,
                  }}
                />
                <LinearGradient
                  // Background Linear Gradient
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  colors={[
                    "transparent",
                    "rgba(23,23,23,0.8)",
                    "rgba(23,23,23,1)",
                  ]}
                  style={{ width: width, height: height * 0.4 }}
                  className="absolute bottom-0"
                />
              </View>
              {!loading && (
                <>
                  {/* Movie Detail */}
                  <View
                    style={{ marginTop: -(height * 0.09) }}
                    className="space-y-3"
                  >
                    {/* Title */}
                    <Text className="text-white text-center text-3xl font-bold tracking-wider px-2">
                      {movieDetail.title}
                    </Text>
                    {/* status */}
                    <Text className=" text-neutral-400 font-semibold text-base text-center">
                      {movieDetail.status} - {movieDetail.release_date} -{" "}
                      {movieDetail.runtime} mins
                    </Text>
                    {/* genres */}
                    <View className="flex-row justify-center mx-4 space-x-2">
                      {/* <Text className="text-neutral-400 font-semibold text-base text-center">
                Action -
              </Text>
              <Text className="text-neutral-400 font-semibold text-base text-center">
                Thrill -
              </Text>
              <Text className="text-neutral-400 font-semibold text-base text-center">
                Comedy
              </Text> */}
                      {movieDetail.genres &&
                        movieDetail.genres.map((item, index) => {
                          let shoeDot = index + 1 != movieDetail.genres.length;
                          return (
                            <>
                              <Text
                                key={index + item.name}
                                className="text-neutral-400 font-semibold text-base text-center"
                              >
                                {" "}
                                {item.name}
                              </Text>
                              {shoeDot && (
                                <Text
                                  key={index}
                                  className="text-neutral-400 font-semibold text-base text-center"
                                >
                                  {" "}
                                  -
                                </Text>
                              )}
                            </>
                          );
                        })}
                      {/* description */}
                    </View>
                    <Text className="text-neutral-400 mx-4 tracking-wide">
                      {movieDetail.overview}
                    </Text>
                  </View>
                  {/* cast */}
                  <Cast cast={cast} />
                  {/* similarMovie */}
                  <MovieList
                    title="Similar Movies"
                    seeAll={false}
                    data={similarMovies}
                  />
                </>
              )}
            </>
          </ScrollView>
        )}
        <View
          contentContainerStyle={{ paddingBottom: 20 }}
          // className="flex-1 bg-neutral-900"
        >
          {/* back btn and movie poster */}
        </View>

        {/* <Text>T</Text> */}
      </View>
    </View>
  );
};

export default Movie;
