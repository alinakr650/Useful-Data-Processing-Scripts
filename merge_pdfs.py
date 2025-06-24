#!/usr/bin/env python3
"""
merge_pdfs.py

A script to crawl through all PDF files in a specified folder and merge them into a single PDF.
Files are sorted by their leading numeric prefix to ensure correct order.
Usage:
    python merge_pdfs.py <input_folder> <output_pdf>
"""
import os
import sys
import re
from PyPDF2 import PdfMerger

def merge_pdfs(input_folder, output_path):
    """Merge all PDF files in the input_folder into a single PDF at output_path."""
    if not os.path.isdir(input_folder):
        print(f"Error: '{input_folder}' is not a valid directory.")
        sys.exit(1)

    # Gather all PDF files in the folder
    pdf_files = [f for f in os.listdir(input_folder) if f.lower().endswith('.pdf')]
    if not pdf_files:
        print(f"No PDF files found in '{input_folder}'.")
        sys.exit(0)

    # Sort filenames by leading numeric prefix, then alphabetically
    def sort_key(filename):
        match = re.match(r"^(\d+)_", filename)
        if match:
            return (int(match.group(1)), filename)
        return (float('inf'), filename)

    pdf_files.sort(key=sort_key)

    merger = PdfMerger()
    for pdf in pdf_files:
        full_path = os.path.join(input_folder, pdf)
        print(f"Adding '{full_path}'...")
        merger.append(full_path)

    # Write out the merged PDF
    with open(output_path, 'wb') as fout:
        merger.write(fout)
    print(f"Successfully merged {len(pdf_files)} files into '{output_path}'.")


def main():
    if len(sys.argv) != 3:
        print("Usage: python merge_pdfs.py <input_folder> <output_pdf>")
        sys.exit(1)

    input_folder = sys.argv[1]
    output_pdf = sys.argv[2]
    merge_pdfs(input_folder, output_pdf)


if __name__ == "__main__":
    main()
