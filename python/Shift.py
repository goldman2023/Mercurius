from Schedule_Functions import mt_to_int


class Shift:
    def __init__(self, day, current_state="empty", start_time=None, length=8):
        self.day = day
        self.current_state = current_state
        self.start_time_string = start_time
        if start_time != "X" and start_time != None:
            self.start_time_numeric = mt_to_int(start_time)
        else:
            self.start_time_numeric = []
        self.length = length
        # dictionary of start_time: length
        self.potential_shifts = {}

    @property
    def end_time(self):
        if self.current_state == "filled":
            if self.start_time_string != "X":
                return (self.start_time_numeric + self.length) % 24
        else:
            return None

    def make_rdo(self):
        self.current_state = "rdo"
        self.start_time_string = "X"
        self.start_time_numeric = []
        self.length = 8

    def fill(self, start_time, length):
        self.current_state = "filled"
        self.start_time_string = start_time
        self.start_time_numeric = mt_to_int(start_time)
        self.length = length

    def clear(self):
        self.current_state = "empty"
        self.start_time_string = None
        self.start_time_numeric = []
        self.length = 8

    def generate_potential_shifts(self):
        pass

    def update_potential_shifts(self):
        pass

