import os
from dotenv import load_dotenv

def load_env():
    """Load environment variables from the root .env file."""
    # Compute the absolute path to your project root .env file
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    env_path = os.path.join(base_dir, ".env")

    # Load it explicitly
    load_dotenv(dotenv_path=env_path, override=True)
    print(f"✅ Loaded environment variables from: {env_path}")
