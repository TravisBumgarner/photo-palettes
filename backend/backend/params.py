import json
import os
from typing import List

from pydantic import BaseModel


class SyncParams(BaseModel):
    supported_image_types: List[str]


# Load and parse config
current_dir = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(current_dir, "sync_params.json"), "r") as f:
    config = json.load(f)

# ✅ Extract "backend" types
supported_image_types_backend: List[str] = config["supported_image_types"]["backend"]
print("ruda", supported_image_types_backend)
sync_params = SyncParams(supported_image_types=supported_image_types_backend)
