"use client";

import { useEffect, useState } from "react";
import type { FormState } from "@/lib/admin-actions";
import { bundledPhotos, serviceIcons } from "@/lib/media";
import { ActionForm, SubmitButton } from "./forms";

export type ResolvedField = {
  name: string;
  kind: "text" | "textarea" | "body" | "slug" | "number" | "checkbox" | "icon" | "image";
  label: string;
  hint?: string;
  required?: boolean;
  max?: number;
  min?: number;
};

export type ItemFormText = {
  arabic: string;
  english: string;
  save: string;
  saving: string;
  noImage: string;
  uploadImage: string;
  bundled: string;
  current: string;
  required: string;
};

type Values = Record<string, string | number | boolean | null>;

function ImageField({ field, value, text, error }: { field: ResolvedField; value: string; text: ItemFormText; error?: string }) {
  const [choice, setChoice] = useState(value ? "keep" : "");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  useEffect(() => () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
  }, [filePreview]);
  const shown =
    filePreview ??
    (choice === "keep" ? value : choice);
  const src = shown.startsWith("photo:") ? `/images/${shown.slice(6)}-640.webp` : shown;
  return (
    <fieldset className="a-field a-image">
      <legend>{field.label}</legend>
      <div className="a-image-row">
        <div className="a-image-preview">{src ? <img src={src} alt="" /> : <span>{text.noImage}</span>}</div>
        <div className="a-image-controls">
          <select name={field.name} value={choice} onChange={(e) => setChoice(e.target.value)} disabled={Boolean(filePreview)}>
            {value && <option value="keep">{text.current}</option>}
            <option value="">{text.noImage}</option>
            {bundledPhotos.map((p) => (
              <option key={p} value={`photo:${p}`}>
                {text.bundled}: {p}
              </option>
            ))}
          </select>
          <label className="a-file">
            <span>{text.uploadImage}</span>
            <input
              type="file"
              name={`${field.name}File`}
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFilePreview(file ? URL.createObjectURL(file) : null);
              }}
            />
          </label>
        </div>
      </div>
      {error && <p className="a-error">{error}</p>}
    </fieldset>
  );
}

export function ItemForm({
  action,
  fields,
  values,
  text,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  fields: ResolvedField[];
  values: Values;
  text: ItemFormText;
}) {
  const str = (key: string) => {
    const v = values[key];
    return v === null || v === undefined ? "" : String(v);
  };
  return (
    <ActionForm action={action} className="a-form" encType="multipart/form-data">
      {(state) => {
        const errors = state.status === "error" ? state.fields ?? {} : {};
        return (
          <>
            {fields.map((field) => {
              switch (field.kind) {
                case "text":
                case "textarea":
                case "body":
                  return (
                    <fieldset key={field.name} className="a-field a-bilingual">
                      <legend>
                        {field.label}
                        {field.required && <span className="a-req"> *</span>}
                      </legend>
                      {field.hint && <p className="a-hint">{field.hint}</p>}
                      <div className="a-pair">
                        {(["Ar", "En"] as const).map((suffix) => {
                          const key = `${field.name}${suffix}`;
                          const common = {
                            name: key,
                            defaultValue: str(key),
                            maxLength: field.max,
                            dir: suffix === "Ar" ? "rtl" : "ltr",
                            lang: suffix === "Ar" ? "ar" : "en",
                            required: field.required && suffix === "Ar",
                            "aria-invalid": Boolean(errors[key]) || undefined,
                          } as const;
                          return (
                            <label key={key} className="a-sub">
                              <span>{suffix === "Ar" ? text.arabic : text.english}</span>
                              {field.kind === "text" ? (
                                <input {...common} />
                              ) : (
                                <textarea {...common} rows={field.kind === "body" ? 16 : 4} />
                              )}
                              {errors[key] && <span className="a-error">{errors[key]}</span>}
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                case "slug":
                  return (
                    <label key={field.name} className="a-field">
                      <span>{field.label}</span>
                      <input name={field.name} defaultValue={str(field.name)} dir="ltr" pattern="[a-z0-9\-]*" maxLength={80} />
                      {errors[field.name] && <span className="a-error">{errors[field.name]}</span>}
                    </label>
                  );
                case "number":
                  return (
                    <label key={field.name} className="a-field a-narrow">
                      <span>{field.label}</span>
                      <input
                        name={field.name}
                        type="number"
                        inputMode="numeric"
                        min={field.min}
                        max={field.max}
                        defaultValue={str(field.name)}
                        dir="ltr"
                      />
                      {field.hint && <small className="a-hint">{field.hint}</small>}
                      {errors[field.name] && <span className="a-error">{errors[field.name]}</span>}
                    </label>
                  );
                case "checkbox":
                  return (
                    <label key={field.name} className="a-check">
                      <input type="checkbox" name={field.name} defaultChecked={Boolean(values[field.name])} />
                      <span>{field.label}</span>
                    </label>
                  );
                case "icon":
                  return (
                    <fieldset key={field.name} className="a-field">
                      <legend>{field.label}</legend>
                      <div className="a-icons">
                        {Object.entries(serviceIcons).map(([key, Icon]) => (
                          <label key={key} className="a-icon-choice" title={key}>
                            <input type="radio" name={field.name} value={key} defaultChecked={(str(field.name) || "activity") === key} />
                            <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                            <span className="sr-only">{key}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                case "image":
                  return <ImageField key={field.name} field={field} value={str(field.name)} text={text} error={errors[field.name]} />;
              }
            })}
            <div className="a-actions">
              <SubmitButton pendingLabel={text.saving}>{text.save}</SubmitButton>
            </div>
          </>
        );
      }}
    </ActionForm>
  );
}
