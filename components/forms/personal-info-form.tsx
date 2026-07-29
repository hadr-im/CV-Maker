"use client";

import { useState } from "react";

import { useCV } from "@/lib/cv-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldRow } from "@/components/forms/form-parts";

const SUMMARY_LIMIT = 600;

const SUMMARY_GUIDE = {
  points: [
    "Two sentences is enough. What you study, and what you are looking for.",
    'Cut "passionate" and "hard-working". Everyone writes them.',
  ],
  example:
    "Third-year computer science student. Looking for a summer internship in web development.",
};

export function PersonalInfoForm() {
  const { cvData, updatePersonalInfo } = useCV();
  const { personalInfo } = cvData;

  // Revealed by the checkbox, but stays open if a link is already saved.
  const [showGithub, setShowGithub] = useState(personalInfo.github.length > 0);

  return (
    <div className="flex flex-col gap-5">
      <Field label="Full name" htmlFor="fullName" required>
        <Input
          id="fullName"
          value={personalInfo.fullName}
          onChange={(event) =>
            updatePersonalInfo({ fullName: event.target.value })
          }
          placeholder="Amine Boudaga"
          autoComplete="name"
        />
      </Field>

      <FieldRow>
        <Field label="Email address" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(event) =>
              updatePersonalInfo({ email: event.target.value })
            }
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Phone number" htmlFor="phone">
          <Input
            id="phone"
            type="tel"
            value={personalInfo.phone}
            onChange={(event) =>
              updatePersonalInfo({ phone: event.target.value })
            }
            placeholder="+216 00 000 000"
            autoComplete="tel"
          />
        </Field>
      </FieldRow>

      <Field
        label="Location"
        htmlFor="location"
        hint="City and country is enough — no street address."
      >
        <Input
          id="location"
          value={personalInfo.location}
          onChange={(event) =>
            updatePersonalInfo({ location: event.target.value })
          }
          placeholder="Tunis, Tunisia"
          autoComplete="address-level2"
        />
      </Field>

      <FieldRow>
        <Field label="LinkedIn" htmlFor="linkedin">
          <Input
            id="linkedin"
            type="url"
            inputMode="url"
            value={personalInfo.linkedin}
            onChange={(event) =>
              updatePersonalInfo({ linkedin: event.target.value })
            }
            placeholder="https://linkedin.com/in/you"
          />
        </Field>

        <Field
          label="Personal website"
          htmlFor="portfolio"
          hint="A portfolio, or wherever your work lives."
        >
          <Input
            id="portfolio"
            type="url"
            inputMode="url"
            value={personalInfo.portfolio}
            onChange={(event) =>
              updatePersonalInfo({ portfolio: event.target.value })
            }
            placeholder="https://yourname.com"
          />
        </Field>
      </FieldRow>

      {/* Behind a checkbox because most people do not have one, and an empty
          GitHub box on every CV reads as something missing. */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="hasGithub"
            checked={showGithub}
            onChange={(event) => {
              setShowGithub(event.target.checked);
              if (!event.target.checked) updatePersonalInfo({ github: "" });
            }}
          />
          <Label htmlFor="hasGithub" className="cursor-pointer text-foreground">
            I have a GitHub
          </Label>
        </div>

        {showGithub && (
          <Field label="GitHub" htmlFor="github" className="animate-fade-in">
            <Input
              id="github"
              type="url"
              inputMode="url"
              value={personalInfo.github}
              onChange={(event) =>
                updatePersonalInfo({ github: event.target.value })
              }
              placeholder="https://github.com/you"
            />
          </Field>
        )}
      </div>

      <Field
        label="Professional summary"
        htmlFor="summary"
        guide={SUMMARY_GUIDE}
        hint={`${personalInfo.summary.length}/${SUMMARY_LIMIT}`}
      >
          <Textarea
            id="summary"
            value={personalInfo.summary}
            maxLength={SUMMARY_LIMIT}
            onChange={(event) =>
              updatePersonalInfo({ summary: event.target.value })
            }
            placeholder="Third-year computer science student…"
            className="min-h-28"
          />
      </Field>
    </div>
  );
}
