import React from "react"
import { render } from "@react-email/render"
import { PlaidVerifyIdentityEmail } from "./plaid-verify-identity"
import { StripeWelcomeEmail } from "./stripe-welcome"
import { NotionMagicLinkEmail } from "./notion-magic-link"

export const pages: IPage[] = [
  {
    id: "PLAID_VERIFY_IDENTITY_EMAIL", // por padrão, tente manter o id como o nome do componente em maiúsculo no formato snake case
    code: render(<PlaidVerifyIdentityEmail validationCode="{{validationCode}}"/>), // mantenha sempre "{{validationCode}}" para facilitar a detecção dinâmica deste campo
    fields: ['validationCode'] // adicione todos os nomes de campos aqui
  },
  {
    id: "STRIPE_WELCOME_EMAIL",
    code: render(<StripeWelcomeEmail/>)
  },
  {
    id: "NOTION_MAGIC_LINK_EMAIL",
    code: render(<NotionMagicLinkEmail loginCode="{{loginCode}}"/>),
    fields: ['loginCode']
  }
]
