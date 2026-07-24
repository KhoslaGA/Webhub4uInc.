"use client";
import { BUSINESS, telHref } from "@/lib/business";
import { track } from "@/lib/analytics";

/** Clickable business phone that fires the call_click conversion event.
 *  Pass `number` to override (e.g. a call-tracking number on ad pages).
 *  Renders nothing if no phone is configured. */
const PhoneLink = ({ source = "site", className, children, number }) => {
  const phone = number || BUSINESS.phone;
  const href = telHref(phone);
  if (!href) return null;
  return (
    <a
      href={href}
      className={className}
      onClick={() => track("call_click", { source })}
    >
      {children || phone}
    </a>
  );
};

export default PhoneLink;
