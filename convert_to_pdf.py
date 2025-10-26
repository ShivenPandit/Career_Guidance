#!/usr/bin/env python3
"""
Convert README.md to PDF with proper formatting
"""

import markdown
import pdfkit
import os

def convert_markdown_to_pdf(md_file_path, pdf_file_path):
    """
    Convert Markdown file to PDF with custom styling
    """
    
    # Read the markdown file
    with open(md_file_path, 'r', encoding='utf-8') as file:
        md_content = file.read()
    
    # Convert markdown to HTML with extensions
    html = markdown.markdown(
        md_content,
        extensions=[
            'markdown.extensions.tables',
            'markdown.extensions.toc',
            'markdown.extensions.fenced_code',
            'markdown.extensions.codehilite'
        ]
    )
    
    # Add CSS styling for better PDF appearance
    styled_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Career Guidance - README</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }}
            
            h1 {{
                color: #2c3e50;
                border-bottom: 3px solid #3498db;
                padding-bottom: 10px;
            }}
            
            h2 {{
                color: #34495e;
                border-bottom: 1px solid #bdc3c7;
                padding-bottom: 5px;
                margin-top: 30px;
            }}
            
            h3 {{
                color: #2980b9;
            }}
            
            code {{
                background-color: #f8f9fa;
                padding: 2px 4px;
                border-radius: 3px;
                font-family: 'Consolas', 'Monaco', monospace;
            }}
            
            pre {{
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 5px;
                padding: 15px;
                overflow-x: auto;
            }}
            
            blockquote {{
                border-left: 4px solid #3498db;
                margin: 0;
                padding-left: 20px;
                color: #555;
            }}
            
            table {{
                border-collapse: collapse;
                width: 100%;
                margin: 20px 0;
            }}
            
            th, td {{
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }}
            
            th {{
                background-color: #f8f9fa;
                font-weight: bold;
            }}
            
            .emoji {{
                font-size: 1.2em;
            }}
            
            ul, ol {{
                padding-left: 30px;
            }}
            
            li {{
                margin-bottom: 5px;
            }}
        </style>
    </head>
    <body>
        {html}
    </body>
    </html>
    """
    
    # Configure PDF options
    options = {
        'page-size': 'A4',
        'margin-top': '0.75in',
        'margin-right': '0.75in',
        'margin-bottom': '0.75in',
        'margin-left': '0.75in',
        'encoding': 'UTF-8',
        'no-outline': None,
        'enable-local-file-access': None
    }
    
    try:
        # Convert HTML to PDF
        pdfkit.from_string(styled_html, pdf_file_path, options=options)
        print(f"✅ Successfully converted {md_file_path} to {pdf_file_path}")
        return True
    except Exception as e:
        print(f"❌ Error converting to PDF: {e}")
        print("📝 Note: This method requires wkhtmltopdf to be installed")
        return False

def main():
    # File paths
    md_file = "README.md"
    pdf_file = "README.pdf"
    
    # Check if markdown file exists
    if not os.path.exists(md_file):
        print(f"❌ Error: {md_file} not found")
        return
    
    # Convert to PDF
    success = convert_markdown_to_pdf(md_file, pdf_file)
    
    if success:
        # Get file size
        size = os.path.getsize(pdf_file)
        print(f"📄 PDF created: {pdf_file} ({size:,} bytes)")
    else:
        print("🔄 Trying alternative method...")
        # Fallback: create a simple HTML version
        create_html_version(md_file)

def create_html_version(md_file):
    """
    Create an HTML version as fallback
    """
    try:
        with open(md_file, 'r', encoding='utf-8') as file:
            md_content = file.read()
        
        html = markdown.markdown(md_content, extensions=['tables', 'toc', 'fenced_code'])
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Career Guidance - README</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }}
                h1 {{ color: #333; border-bottom: 2px solid #333; }}
                h2 {{ color: #666; }}
                code {{ background: #f4f4f4; padding: 2px 5px; }}
                pre {{ background: #f4f4f4; padding: 10px; overflow-x: auto; }}
            </style>
        </head>
        <body>
            {html}
        </body>
        </html>
        """
        
        with open("README.html", 'w', encoding='utf-8') as file:
            file.write(html_content)
        
        print("✅ Created README.html - you can open this in browser and print to PDF")
        
    except Exception as e:
        print(f"❌ Error creating HTML: {e}")

if __name__ == "__main__":
    main()