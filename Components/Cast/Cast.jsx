import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { fallbackPersonImage, image185 } from "../../api/api";

const Cast = ({ cast }) => {
  let personName = "The Rock";
  let characterName = "KSI";
  const navigation = useNavigation();

  return (
    <View className="my-6">
      <Text className="text-white text-lg mx-4 mb-b">Top Cast</Text>
      <ScrollView
        className="mt-3"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast &&
          cast.map((person, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="mr-4 items-center"
                onPress={() => {
                  navigation.navigate("Person", person);
                }}
              >
                <Image
                  className="rounded-full h-20 w-20 border border-neutral-500"
                  source={{
                    uri: image185(person.profile_path) || fallbackPersonImage,
                  }}
                />
                <Text className=" text-white text-xs my-1">
                  {person.character.length > 10
                    ? person.character.slice(0, 10) + "..."
                    : person.character}
                </Text>
                <Text className="text-neutral-400 text-xs my-1">
                  {person.original_name.length > 10
                    ? person.original_name.slice(0, 10) + "..."
                    : person.original_name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default Cast;
