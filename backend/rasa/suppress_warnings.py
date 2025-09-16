#!/usr/bin/env python3
"""
Rasa wrapper script to suppress deprecation warnings from pkg_resources and other libraries.
This script imports the necessary modules and suppresses warnings before starting Rasa.
"""

import warnings
import sys
import os

# Suppress specific deprecation warnings
warnings.filterwarnings("ignore", category=DeprecationWarning, module="pkg_resources")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="setuptools")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="ruamel")
warnings.filterwarnings("ignore", category=PendingDeprecationWarning)
warnings.filterwarnings("ignore", category=UserWarning)

# Set environment variables to suppress warnings
os.environ["PYTHONWARNINGS"] = "ignore::DeprecationWarning,ignore::PendingDeprecationWarning,ignore::UserWarning"

# Import and run rasa
if __name__ == "__main__":
    # Import rasa after setting up warning filters
    import rasa
    
    # Run the main rasa command
    sys.argv[0] = "rasa"
    from rasa.__main__ import main
    main()
