import { pages } from ".."
import { Firestore } from "firebase-admin/firestore"
import { initializeApp } from "firebase-admin/app"
import admin from 'firebase-admin';

export class Generator {
	private readonly firestore: Firestore;
	private readonly emailTemplateCollection

	constructor() {
		initializeApp({
			projectId: process.env.FIRESTORE_GCP_PROJECT
		})

		this.firestore = admin.firestore();
		this.firestore.settings({
			ignoreUndefinedProperties: false,
			databaseId: process.env.FIRESTORE_DATABASE_ID
		})
		this.emailTemplateCollection = this.firestore.collection("email-templates")
	}

	private async saveAllEmailTemplates() {
		const templates = await this.emailTemplateCollection.get();
		if(!templates.empty) 
			await this.firestore.runTransaction(async (t) => {
				templates.forEach((template) => {
					t.delete(template.ref)
				})
			})

		pages.forEach(async (page) => {
			await this.firestore.runTransaction(async (t) => {
				const docRef = this.emailTemplateCollection.doc(page.id)
				t.set(docRef, {
					code: page.code,
					fields: page.fields
				})
			})
		})
	}

	exec() {
		this.saveAllEmailTemplates()
	}
}

new Generator().exec();
