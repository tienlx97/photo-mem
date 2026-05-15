"use client";

import {
  Button,
  Input,
  Label,
  Link,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  TextArea,
  TextField
} from "react-aria-components";

export function PageHeader({
  eyebrow,
  title,
  description,
  action
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="header-action">{action}</div> : null}
    </header>
  );
}

export function PrimaryLink({ href, children }) {
  return (
    <Link href={href} className="btn btn-primary">
      <span aria-hidden="true">+</span>
      {children}
    </Link>
  );
}

export function SecondaryLink({ href, children }) {
  return (
    <Link href={href} className="btn btn-secondary">
      {children}
    </Link>
  );
}

export function Field({
  "aria-label": ariaLabel,
  className = "field",
  defaultValue,
  inputClassName,
  isRequired,
  label,
  onChange,
  placeholder,
  type = "text",
  value
}) {
  return (
    <TextField
      className={className}
      defaultValue={defaultValue}
      isRequired={isRequired}
      onChange={onChange}
      value={value}
    >
      {label ? <Label>{label}</Label> : null}
      <Input
        aria-label={ariaLabel}
        className={inputClassName}
        placeholder={placeholder}
        type={type}
      />
    </TextField>
  );
}

export function TextAreaField({
  "aria-label": ariaLabel,
  className = "field",
  defaultValue,
  isRequired,
  label,
  onChange,
  placeholder,
  rows,
  value
}) {
  return (
    <TextField
      className={className}
      defaultValue={defaultValue}
      isRequired={isRequired}
      onChange={onChange}
      value={value}
    >
      {label ? <Label>{label}</Label> : null}
      <TextArea aria-label={ariaLabel} placeholder={placeholder} rows={rows} />
    </TextField>
  );
}

export function SelectField({
  children,
  className = "field aria-select",
  defaultSelectedKey,
  label,
  onSelectionChange,
  selectedKey
}) {
  return (
    <Select
      className={className}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={(key) => onSelectionChange?.(String(key))}
      selectedKey={selectedKey}
    >
      {label ? <Label>{label}</Label> : null}
      <Button className="aria-select-trigger">
        <SelectValue />
        <span aria-hidden="true">⌄</span>
      </Button>
      <Popover className="aria-popover">
        <ListBox className="aria-listbox">{children}</ListBox>
      </Popover>
    </Select>
  );
}

export function SelectItem({ children, id, textValue }) {
  return (
    <ListBoxItem className="aria-listbox-item" id={id} textValue={textValue ?? String(children)}>
      {children}
    </ListBoxItem>
  );
}

export function StatCard({
  label,
  value,
  accent
}) {
  return (
    <div className="stat-card" style={accent ? { borderColor: accent } : undefined}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
