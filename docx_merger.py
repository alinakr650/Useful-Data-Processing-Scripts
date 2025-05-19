import os
from docx import Document
from docxcompose.composer import Composer


def collect_docx_files(root_folder, extensions=(".docx",)):
    """
    Walks root_folder and yields full paths to all files ending in extensions.
    """
    for dirpath, _, filenames in os.walk(root_folder):
       for fn in filenames:
            # skip Word temp/lock files that start with "~$"
            if fn.startswith("~$"):
                continue
            if fn.lower().endswith(extensions):
                yield os.path.join(dirpath, fn)

def merge_documents(input_folder, output_path):
    """
    Merges all .docx in input_folder into a single document at output_path.
    """
    # Start from the first document as the base
    files = sorted(collect_docx_files(input_folder))
    if not files:
        raise FileNotFoundError(f"No .docx files found in {input_folder!r}")

    master = Document(files[0])
    composer = Composer(master)

    # Append the rest
    for doc_path in files[1:]:
        doc = Document(doc_path)
        composer.append(doc)
        print(f"Appended: {os.path.basename(doc_path)}")

    composer.save(output_path)
    print(f"\nMerged {len(files)} documents into {output_path!r}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Merge all .docx in a folder (and subfolders) into one document, preserving images."
    )
    parser.add_argument("input_folder", help="Path to folder containing .docx files")
    parser.add_argument("output_file", help="Filename for the merged .docx")
    args = parser.parse_args()

    merge_documents(args.input_folder, args.output_file)
