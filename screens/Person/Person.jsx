import {
  View,
  Text,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";

import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import MovieList from "../../Components/MovieList/MovieList";
import Loading from "../../Components/Loading/Loading";
import {
  fallbackPersonImage,
  fetchPersonDetails,
  fetchPersonMovies,
  image342,
} from "../../api/api";

const Person = () => {
  const { params: person } = useRoute();
  var { width, height } = Dimensions.get("window");
  const ios = Platform.OS == "ios";
  const verticalMargin = ios ? 0 : 20;
  const [isFavourite, toggleFavourite] = useState(false);
  const navigation = useNavigation();
  const [personMovies, setPersonMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [personDetail, setPersonDetail] = useState({});
  const getPersonDetail = async () => {
    const res = await fetchPersonDetails(person.id);
    // console.log(res);
    return res;
  };
  const gatPersonMovie = async () => {
    const res = await fetchPersonMovies(person.id);
    // console.log(res);
    return res;
  };
  useEffect(() => {
    setLoading(true);
    // console.log(person);
    Promise.all([getPersonDetail(), gatPersonMovie()]).then((res) => {
      // console.log(res[0]);
      // console.log(res[1].cast);
      if (res[1] && res[1].cast) setPersonMovies(res[1].cast);
      if (res[0]) setPersonDetail(res[0]);
      setLoading(false);
    });
  }, [person]);
  return (
    <View className="flex-1 bg-neutral-900">
      <SafeAreaView
        className={`absolute bg-transparent z-20 w-full flex-row justify-between items-center px-4 top-4 ${verticalMargin}`}
      >
        <TouchableOpacity
          className="rounded-xl p-1 bg-[#eab308]"
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={"28"} strokeWidth={2.5} color={"#fff"} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
          <HeartIcon size={35} color={isFavourite ? "red" : "#fff"} />
        </TouchableOpacity> */}
      </SafeAreaView>
      {personDetail !== undefined && loading ? (
        <Loading />
      ) : (
        <ScrollView
          className="flex-1 bg-neutral-900"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* back btn and heart */}
          {/* <SafeAreaView
            className={`z-20 w-full flex-row justify-between items-center px-4 top-4 ${verticalMargin}`}
          >
            <TouchableOpacity
              className="rounded-xl p-1 bg-[#eab308]"
              onPress={() => navigation.goBack()}
            >
              <ChevronLeftIcon size={"28"} strokeWidth={2.5} color={"#fff"} />
            </TouchableOpacity>
           
          </SafeAreaView> */}
          <View>
            <SafeAreaView
              className="flex-row justify-center"
              style={{
                shadowColor: "gray",
                shadowRadius: 40,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 1,
                marginVertical: verticalMargin,
              }}
            >
              <Image
                className="rounded-full border-2 border-neutral-400"
                source={{
                  uri:
                    image342(personDetail.profile_path) || fallbackPersonImage,
                }}
                style={{ height: width * 0.74, width: width * 0.74 }}
              />
            </SafeAreaView>
            <View className="mt-6">
              <Text className="text-3xl text-white font-bold text-center">
                {personDetail.name}
              </Text>
              <Text className="text-base text-neutral-500 font-bold text-center">
                {personDetail.place_of_birth}
              </Text>
            </View>
            <View className="mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full">
              <View className="w-1/4 border-r-2 px-2 border-r-neutral-400 items-center">
                <Text className="text-white font-semibold">Gender</Text>
                <Text className="text-neutral-300 text-sm">
                  {personDetail.gender === "1" ? "Female" : "Male" || "Unknown"}
                </Text>
              </View>
              <View className="w-1/4 border-r-2 px-2 border-r-neutral-400 items-center">
                <Text className="text-white font-semibold">Birthday</Text>
                <Text className="text-neutral-300 text-sm">
                  {personDetail.birthday || "Unknown"}
                </Text>
              </View>
              <View className="w-1/4 border-r-2 px-2 border-r-neutral-400 items-center">
                <Text className="text-white font-semibold">Known For</Text>
                <Text className="text-neutral-300 text-sm">
                  {personDetail.known_for_department || "Unknown"}
                </Text>
              </View>
              <View className="w-1/4 px-2 items-center">
                <Text className="text-white font-semibold">Popularity</Text>
                <Text className="text-neutral-300 text-sm">
                  {personDetail.popularity || "Unknown"}
                </Text>
              </View>
            </View>
            <View className=" my-6 mx-4 space-y-2">
              <Text className="text-white text-lg">Biography</Text>
              <Text className="text-neutral-400 tracking-wide">
                {personDetail.biography || "Unknown"}
              </Text>
            </View>
            <MovieList data={personMovies} title={"Movies"} seeAll={false} />
          </View>
          {/* Person Details */}
        </ScrollView>
      )}
    </View>
  );
};

export default Person;
