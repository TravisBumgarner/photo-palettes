from pydantic import BaseModel


class TSwatch(BaseModel):
    color: str
    percent_location: tuple[float, float]


TGeneratedPalette = list[TSwatch]
