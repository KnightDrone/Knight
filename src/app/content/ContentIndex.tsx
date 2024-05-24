import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Button } from "../../ui/Button";

export function ContentIndex({ navigation }: any) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center gap-4 p-8">
      <Text className="text-3xl font-semibold mb-8">{t("content.title")}</Text>
      <Button
        imgSrc={require("../../../assets/images/content/icons/1.png")}
        text={t("content.guide-1.title")}
        onPress={() => navigation.navigate("Guide1")}
        style="secondary"
      />
      <Button
        imgSrc={require("../../../assets/images/content/icons/2.png")}
        text={t("content.guide-2.title")}
        onPress={() => navigation.navigate("Guide2")}
        style="secondary"
      />
      <Button
        imgSrc={require("../../../assets/images/content/icons/3.png")}
        text={t("content.guide-3.title")}
        onPress={() => navigation.navigate("Guide3")}
        style="secondary"
      />
      <Button
        imgSrc={require("../../../assets/images/content/icons/4.png")}
        text={t("content.guide-4.title")}
        onPress={() => navigation.navigate("Guide4")}
        style="secondary"
      />
      <Button
        imgSrc={require("../../../assets/images/content/icons/5.png")}
        text={t("content.guide-5.title")}
        onPress={() => navigation.navigate("Guide5")}
        style="secondary"
      />
    </View>
  );
}
