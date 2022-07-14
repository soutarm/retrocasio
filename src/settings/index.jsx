function mySettings(props) {
  return (
    <Page>
      <Section
        description={<Text>Set 12/24 hour display in Advanced Settings on <Link source="https://www.fitbit.com/settings/profile">your profile on Fitbit.com</Link>.</Text>}
      >
        <Text bold align="center">⌚ &nbsp; &nbsp; &nbsp; &nbsp; RETROCASIO SETTINGS &nbsp; &nbsp; &nbsp; &nbsp; ⌚</Text>
      </Section>
      <Section
        description={<Text>Get a sneak peek at our Always on Display (Versa 2 only). Coming soon! ...when Fitbit opens the option up to all watchmakers.</Text>}
        >
        <Toggle
          settingsKey="toggleDarkMode"
          label="🌚 Dark Mode (AoD preview)"
        />
      </Section>
      <Section description={
          <Text>Keep this disabled to use the watch itself to change options.
          👉 tap watch frame to toggle Dark Mode
          👉 tap time to toggle backlight (not available in Dark Mode)
          👉 tap seconds to toggle them on/off
          👉 tap steps to toggle adjusted steps
          👉 tap battery percentage to toggle calories on/off
        </Text>
        } >
        <Toggle
          settingsKey="toggleTouch"
          label="🚫 Disable Touch Controls"
        />
      </Section>
      <Section description={
          <Text>Does what it says on the box</Text>
        }>
        <Toggle
          settingsKey="toggleSeconds"
          label="🕘 Hide Seconds"
        />
      </Section>
      <Section description={
          <Text>Toggle between calories burned and battery percentage. The battery meter icon will still function while displaying calories.</Text>
        }>
        <Toggle
          settingsKey="toggleCalories"
          label="🥗 Show Calories"
        />
      </Section>
      <Section description={
          <Text>Some exercise equipment, like LifeFitness treadmills, will double-count your daily steps if synced with your Fitbit account. This can lead to inaccurate daily step count.</Text>
        }>
        <Toggle
          settingsKey="toggleAdjusted"
          label="🤓 Show Adjusted Steps"
        />
      </Section>
      <Section>
        <Text bold align="center">💝 Enjoying this free watch? 💝</Text><Text align="center">Please consider <Link source="https://paypal.me/soutarm/1.99usd">☕ buying me a coffee ☕</Link> to keep me awake, encourage further enhancements and help with tech support.</Text>
      </Section>
      <Section>  
        <Button
          list
          label="Reset Settings"
          onClick={() => props.settingsStorage.clear()}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
