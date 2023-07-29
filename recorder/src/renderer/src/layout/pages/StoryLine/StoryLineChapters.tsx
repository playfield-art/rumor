import React, { useEffect } from "react";
import { Section } from "@components/layout/Section";
import { Grid } from "@mui/material";
import { StoryLineChapter } from "@components/StoryLineChapter";
import { LocalNarrative } from "@shared/interfaces";
import { Utils } from "@shared/utils";

export function StoryLineChapters() {
  const [currentLocalNarrative, setCurrentLocalNarrative] = React.useState<
    LocalNarrative | undefined
  >();

  useEffect(() => {
    window.rumor.methods.getLocalNarrative().then((narrative) => {
      setCurrentLocalNarrative(narrative);
    });
  }, []);

  return (
    <Section title="Chapters">
      <Grid container spacing={2}>
        {currentLocalNarrative &&
          Object.keys(currentLocalNarrative).map((chapter) => {
            const chapterName = chapter.replace("Chapters", "");
            return (
              <Grid key={chapter} item xs={12} sm={4} md={3} lg={2}>
                <StoryLineChapter
                  chapter={Utils.capitalize(chapterName)}
                  storyLineChapterOptions={[
                    { id: "random", title: "Random" },
                    ...currentLocalNarrative[
                      chapter as keyof LocalNarrative
                    ].map((o) => ({
                      id: o.id,
                      title: o.title,
                    })),
                  ]}
                  onStoryLineChapterOptionChange={async (option) => {
                    if (option) {
                      await window.rumor.methods.setSelectedChapterOption({
                        chapter: chapterName,
                        optionId: option.id,
                      });
                    }
                  }}
                />
              </Grid>
            );
          })}
      </Grid>
    </Section>
  );
}
