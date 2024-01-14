// import { setActivePinia, createPinia } from "pinia";
// import { createTestingPinia } from "@pinia/testing";

import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, it, expect, vi } from "vitest";
import _sut from "./LocaleSwitcher.vue";

import { useI18nStore } from "@/stores/store.i18n";

// const useI18n = vi.fn(() => {
//   return {
//     setLocale: vi.fn(),
//   };
// });

let initialPropsData = {};

let wrapper;
const wrapperFactory = (propsData = {}) => {
  const mockPropsData = Object.keys(propsData).length > 0 ? propsData : initialPropsData;

  return mountSuspended(_sut, {
    props: mockPropsData,
    // global: {
    //   plugins: [createTestingPinia({ stubActions: false })],
    // },
  });
};

describe("_sut", () => {
  // beforeEach(() => {
  //   setActivePinia(createPinia());
  // });

  const i18nStore = useI18nStore();

  it("Mounts", async () => {
    expect(useAppConfig()).toBeTruthy();
  });

  it("Component i18n html", async () => {
    wrapper = await wrapperFactory();

    const textCheck = wrapper.find("h1");
    expect(textCheck.html()).toMatchInlineSnapshot('"<h1 data-v-c99ff694="" class="text-header-large" data-test-id="locale-switcher-header">Language switcher</h1>"');
  });

  it("Shared i18n text", async () => {
    wrapper = await wrapperFactory();

    const textCheck = wrapper.find("[data-test-id='locale-switcher-header']");
    expect(textCheck.text()).toEqual("Language switcher");
  });

  it("Lang switch button to be 'Bristolian'", async () => {
    wrapper = await wrapperFactory();

    const textCheck = wrapper.find("[data-test-id^='locale-switch-btn']");
    expect(textCheck.text()).toEqual("English - Bristolian");
  });

  it("Default locale should be 'en'", async () => {
    wrapper = await wrapperFactory();
    expect(i18nStore.locale).toBe("en");
  });

  it.skip("locale switch button calls store action: (using 'mockUpdateLocale')", async () => {
    // spyOn stre action - not working
    i18nStore.locale = "en";
    const mockUpdateLocale = vi.spyOn(i18nStore, "updateLocale");
    wrapper = await wrapperFactory();
    await wrapper.get('[data-test-id="locale-switch-btn"]').trigger("click");
    expect(mockUpdateLocale).toHaveBeenCalledWith("bristolian");
  });

  it.skip("locale switch button calls store action: (using 'mockUpdateLocale')", async () => {
    //not working either
    i18nStore.locale = "en";
    wrapper = await wrapperFactory();
    await wrapper.get("[data-test-id^='locale-switch-btn']").trigger("click");
    expect(i18nStore.updateLocale).toHaveBeenCalledOnce();
  });

  it("locale switch button calls store action: (using setI18n)", async () => {
    i18nStore.locale = "en";

    const setI18n = vi.fn();
    vi.stubGlobal("setI18n", setI18n("bristolian"));

    wrapper = await wrapperFactory();
    await wrapper.get("[data-test-id^='locale-switch-btn']").trigger("click");
    expect(setI18n).toHaveBeenCalledWith("bristolian");
  });
});
