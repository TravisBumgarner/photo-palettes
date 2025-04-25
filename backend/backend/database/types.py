from sqlalchemy.types import UserDefinedType

class Cube(UserDefinedType):
    def get_col_spec(self, **kw):
        return "CUBE"