import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const GuideImages = {
  1: require("../../../assets/images/content/1.webp"),
  2: require("../../../assets/images/content/2.webp"),
  3: require("../../../assets/images/content/3.webp"),
  4: require("../../../assets/images/content/4.webp"),
  5: require("../../../assets/images/content/5.webp"),
};
export function GuideTemplate({
  guideId,
}: {
  guideId: "1" | "2" | "3" | "4" | "5";
}) {
  const { t } = useTranslation();

  return (
    <ScrollView>
      <View className="flex-1 items-center gap-4 px-8 py-32">
        <Image
          className="rounded-3xl w-64 h-64 mb-16"
          source={GuideImages[guideId]}
        />

        <Text className="text-3xl font-semibold mb-8">
          {t(`content.guide-${guideId}.title`)}
        </Text>

        <Text className="text-lg">{t(`content.guide-${guideId}.content`)}</Text>
      </View>
    </ScrollView>
  );
}
