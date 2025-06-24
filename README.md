# Useful-Data-Processing-Scripts

A number of scripts I've written for my use-cases over the years.

1. docx-merger.py - Jams loads of .docx files in one with pictures, graphs, etc. for further processing.
   How to use: ```python merge_docs.py "/Path/to/your/directory" combined_output.docx```

2. merge_pdfs.py - Crawls a given folder for all PDF files, sorts them by any leading numeric prefix (then alphabetically), and merges them into a single output PDF using PyPDF2.

3. openAPI-docs-into-PDFs.js - Starts from a base URL and path, navigates through “Next” links on an OpenAPI‐style documentation site, renders each page to PDF (A4, with backgrounds), and saves them sequentially into an api-docs directory.

4. release-notes-to-PDF.js - Visits paginated release-notes pages (using a ?page= query), captures each page as a PDF via Puppeteer, follows the “›” button to the next page, and stores all output in release-notes-pdfs.
