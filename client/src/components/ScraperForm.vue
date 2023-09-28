<template>
	<div class="bg-white">
		<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-0 lg:px-8">
			<div class="mx-auto max-w-2xl">
				<div>
					<img class="mx-auto w-auto" src="/images/galaxy.png"/>
					<h1 class="text-center text-4xl">Galactic Scraper</h1>
					<p class="text-center text-md tracking-widest pt-1 text-gray-500">We scrape the universe</p>
				</div>
				<form @submit.prevent="handleSubmit">
					<div class="space-y-12">
						<div class="">
							<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								<div class="sm:col-span-6">
									<label for="username" class="block font-medium leading-6 text-gray-900 text-base">URL to be scraped</label>
									<div class="mt-2">
										<div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
											<input type="text" name="url" v-model="urlInput" class="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="URL"/>
										</div>
									</div>
								</div>
							</div>
							<details class="group py-4 mt-4 marker:content-['']">
								<summary class="flex w-full cursor-pointer select-none justify-between text-left text-base font-normal leading-7 text-slate-900 group-open:text-indigo-600 [&amp;::-webkit-details-marker]:hidden">
									<span>
										<span class="text-gray-500">(Optional)</span>
										Select elements to be scrapped
									</span>
									<svg class="ml-4 mt-0.5 h-6 w-6 flex-none stroke-slate-700 group-open:stroke-indigo-500" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M18 12H6"></path>
										<path class="group-open:hidden" d="M12 6v12"></path>
									</svg>
								</summary>
								<div class="pb-6 pt-6 mt-3.5 border px-3 rounded-md">
									<fieldset>
										<div class="space-y-6">
											<div class="relative flex gap-x-3">
												<div class="flex h-6 items-center">
													<input id="checkbox_text" name="scrapping_elements" v-model="scrappingElements['checkbox_text']" type="checkbox" checked class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"/>
												</div>
												<div class="text-sm leading-6">
													<label for="checkbox_text" class="font-medium text-gray-900 cursor-pointer">Texts</label>
												</div>
											</div>
										</div>
									</fieldset>
									<fieldset>
										<div class="space-y-6">
											<div class="relative flex gap-x-3">
												<div class="flex h-6 items-center">
													<input id="checkbox_images" name="scrapping_elements" v-model="scrappingElements['checkbox_images']" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"/>
												</div>
												<div class="text-sm leading-6">
													<label for="checkbox_images" class="font-medium text-gray-900 cursor-pointer">Images</label>
												</div>
											</div>
										</div>
									</fieldset>
									<fieldset>
										<div class="space-y-6">
											<div class="relative flex gap-x-3">
												<div class="flex h-6 items-center">
													<input id="checkbox_links" name="scrapping_elements" v-model="scrappingElements['checkbox_links']" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"/>
												</div>
												<div class="text-sm leading-6">
													<label for="checkbox_links" class="font-medium text-gray-900 cursor-pointer">Links</label>
												</div>
											</div>
										</div>
									</fieldset>
									<fieldset>
										<div class="space-y-6">
											<div class="relative flex gap-x-3">
												<div class="flex h-6 items-center">
													<input id="checkbox_dates" name="scrapping_elements" v-model="scrappingElements['checkbox_dates']" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
												</div>
												<div class="text-sm leading-6">
													<label for="checkbox_dates" class="font-medium text-gray-900">Dates</label>
												</div>
											</div>
										</div>
									</fieldset>
								</div>
							</details>
						</div>
					</div>
					<div class="mt-6 flex items-center justify-between gap-x-6">
						<button type="button" @click="handleWordCount" class="rounded-md bg-sky-600 px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Count words (blog post only)</button>
						<button type="submit" class="rounded-md bg-green-600 px-16 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Scrape it!</button>
					</div>
					<div class="mt-4 text-red-600" v-if="errorMessage">{{ errorMessage }}</div>
				</form>
				<div v-if="responseData">
					<h2 class="text-2xl my-4">Scraped Content:</h2>
					<div v-if="responseData.texts" class="text-content mb-4">
						<div class="border border-gray-300 rounded-md py-2 pr-5 pl-8">
							<h3 class="text-xl font-semibold mb-2">Scraped text</h3>
							<template v-if="responseData.textSentiment">
								<h5 class="text-md font-normal mb-2">Overall sentiment: {{ responseData.textSentiment }}</h5>
								<div class="flex gap-x-4 my-3">
									<div class="flex gap-x-2">
										<div class="bg-green-300 w-4 h-4 rounded-full"></div>
										<p class="text-sm">Positive</p>
									</div>
									<div class="flex gap-x-2">
										<div class="bg-red-300 w-4 h-4 rounded-full"></div>
										<p class="text-sm">Negative</p>
									</div>
									<div class="flex gap-x-2">
										<div class="bg-gray-300 w-4 h-4 rounded-full"></div>
										<p class="text-sm">Neutral</p>
									</div>
								</div>
							</template>
							<template v-if="responseData.wordCount">
								<h5 class="text-md font-normal mb-2">Word count: {{ responseData.wordCount }}</h5>
							</template>
							<ul class="list-disc">
								<template v-for="(item, index) in responseData.texts">
									<li v-if="(item.text)" :key="index" :class="{
										'bg-green-100': item.sentiment === 'positive',
										'bg-red-100': item.sentiment === 'negative',
										'bg-gray-100': item.sentiment === 'neutral',
										}">
										<span class="py-1 px-2 box-decoration-clone">{{ item.text }}</span>
									</li>
								</template>
							</ul>
						</div>
						<div v-if="!responseData.texts.length">No texts found</div>
					</div>
					<div v-if="responseData.images" class="image-content mb-4">
						<h3 class="text-xl font-semibold mb-2">Images:</h3>
						<div class="flex flex-wrap">
							<div v-for="(image, index) in responseData.images" :key="index" class="w-1/2 p-2">
								<img :src="image" alt="Scraped Image" class="max-w-full"/>
							</div>
						</div>
						<div v-if="!responseData.images.length">No images found</div>
					</div>
					<div v-if="responseData.links" class="link-content mb-4">
						<h3 class="text-xl font-semibold mb-2">Links:</h3>
						<ul class="list-disc">
							<li v-for="(link, index) in responseData.links" :key="index">
								<a class="text-blue-800" :key="index" :href="link" target="_blank" rel="noopener noreferrer">
									{{ link }}
									<svg class="stroke-blue-800 w-4 h-4 inline mx-1" xmlns="http://www.w3.org/2000/svg" stroke-width="10" stroke-dashoffset="0" stroke-dasharray="0" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 100 100">
										<polyline fill="none" points="40 20 20 20 20 90 80 90 80 60"/>
										<polyline fill="none" points="60 10 90 10 90 40"/>
										<line fill="none" x1="89" y1="11" x2="50" y2="50"/>
									</svg>
								</a>
							</li>
						</ul>
						<div v-if="!responseData.links.length">No links found</div>
					</div>
					<div v-if="responseData.dates" class="date-content mb-4">
						<h3 class="text-xl font-semibold mb-2">Dates:</h3>
						<p v-for="(date, index) in responseData.dates" :key="index">{{ date }}</p>
						<div v-if="!responseData.dates.length">No dates found</div>
					</div>
					<div class="my-2" v-if="!responseData.wordCount">
						<button type="button" @click="handleExport" class="rounded-md bg-green-600 px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Export scraped data to Excel</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-if="loading" class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-opacity-75 bg-white z-50">
		<div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
	</div>
</template>
<script setup>
import axios from 'axios';
import {ref} from 'vue';

// get scrapping elements and the url from the input and checkboxes
const urlInput          = ref(null);
const scrappingElements = ref({
	checkbox_text:   true,
	checkbox_images: false,
	checkbox_links:  false,
	checkbox_dates:  false
});
const responseData      = ref(null);
const errorMessage      = ref(null);
const loading = ref(false);

const handleSubmit = async () => {
	try {
		errorMessage.value = null;
		loading.value = true;
		const response     = await axios.post("http://localhost:3000/scrape", {
			url:               urlInput.value,
			scrappingElements: scrappingElements.value
		});
		if (response.data.status === 'error') {
			errorMessage.value = response.data.error;
			return;
		}
		responseData.value = response.data;
	} catch (error) {
		console.error('Error:', error);
		errorMessage.value = 'An error occurred while scraping the page. Please retry later.';
	} finally {
		loading.value = false;
	}
};

const handleWordCount = async () => {
	try {
		errorMessage.value = null;
		loading.value = true;
		const response     = await axios.post("http://localhost:3000/scrape/count-words", {
			url: urlInput.value,
		});
		if (response.data.status === 'error') {
			errorMessage.value = response.data.error;
			return;
		}
		responseData.value = response.data;
	} catch (error) {
		console.error('Error:', error);
		errorMessage.value = 'An error occurred while counting words. Please retry later.';
	} finally {
		loading.value = false;
	}
};

const handleExport = async () => {
	try {
		errorMessage.value = null;
		loading.value = true;
		const response     = await axios.post("http://localhost:3000/scrape/export", {
			url:               urlInput.value,
			scrappingElements: scrappingElements.value
		},
		{
			responseType: 'blob'
		});
		if (response.data.status === 'error') {
			errorMessage.value = response.data.error;
			return;
		}
		let filename = 'scraped-data.xlsx';
		const url    = window.URL.createObjectURL(new Blob([response.data],
			{type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
		const link   = document.createElement('a');

		link.href = url;
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
	} catch (error) {
		console.error('Error:', error);
		errorMessage.value = 'An error occurred while exporting the data. Please retry later.';
	} finally {
		loading.value = false;
	}
};
</script>