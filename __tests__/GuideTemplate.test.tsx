import React from "react";
import { render } from "@testing-library/react-native";
import { useTranslation } from "react-i18next";
import { GuideTemplate } from "../src/app/content/GuideTemplate";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the Image component from 'react-native'
// jest.mock('react-native', () => {
//     const RN = jest.requireActual('react-native');
//     RN.Image = (props: any) => <img {...props} />;
//     return RN;
//   });

// const GuideImages = {
//   1: require('../assets/images/content/1.webp'),
//   2: require('../assets/images/content/2.webp'),
//   3: require('../assets/images/content/3.webp'),
//   4: require('../assets/images/content/4.webp'),
//   5: require('../assets/images/content/5.webp'),
// };

describe("GuideTemplate", () => {
  it("renders guide 1 correctly", () => {
    const { getByText, getByRole } = render(<GuideTemplate guideId="1" />);
    //expect(getByRole('img')).toHaveProperty('src', GuideImages[1]);
    expect(getByText("content.guide-1.title")).toBeTruthy();
    expect(getByText("content.guide-1.content")).toBeTruthy();
  });

  it("renders guide 2 correctly", () => {
    const { getByText, getByRole } = render(<GuideTemplate guideId="2" />);
    //expect(getByRole('img')).toHaveProperty('src', GuideImages[2]);
    expect(getByText("content.guide-2.title")).toBeTruthy();
    expect(getByText("content.guide-2.content")).toBeTruthy();
  });

  it("renders guide 3 correctly", () => {
    const { getByText, getByRole } = render(<GuideTemplate guideId="3" />);
    //expect(getByRole('img')).toHaveProperty('src', GuideImages[3]);
    expect(getByText("content.guide-3.title")).toBeTruthy();
    expect(getByText("content.guide-3.content")).toBeTruthy();
  });

  it("renders guide 4 correctly", () => {
    const { getByText, getByRole } = render(<GuideTemplate guideId="4" />);
    //expect(getByRole('img')).toHaveProperty('src', GuideImages[4]);
    expect(getByText("content.guide-4.title")).toBeTruthy();
    expect(getByText("content.guide-4.content")).toBeTruthy();
  });

  it("renders guide 5 correctly", () => {
    const { getByText, getByRole } = render(<GuideTemplate guideId="5" />);
    //expect(getByRole('img')).toHaveProperty('src', GuideImages[5]);
    expect(getByText("content.guide-5.title")).toBeTruthy();
    expect(getByText("content.guide-5.content")).toBeTruthy();
  });
});
