import {COLORS} from '../constant/Themes';

export const getStatusColor = (status: string | null | undefined) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'pending') {
    return '#B88205';
  }
  if (modStatus === 'approved' || modStatus === 'approve') {
    return '#229A16';
  }
  if (modStatus === 'process' || modStatus === 'processing') {
    return '#D841F2';
  }
  if (modStatus === 'rejected' || modStatus === 'reject') {
    return '#FF696C';
  }
};

export const getStatusBgColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'pending') {
    return '#FFF5D7';
  }
  if (modStatus === 'approved' || modStatus === 'approve') {
    return '#E4F8DD';
  }
  if (modStatus === 'process' || modStatus === 'processing') {
    return '#F2E1F5';
  }
  if (modStatus === 'rejected' || modStatus === 'reject') {
    return '#FFE3E3';
  }
};

export const getAttendanceStatusColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'absent') {
    return '#D92D20';
  }
  if (modStatus === 'late') {
    return '#B54708';
  }
  if (modStatus === 'leave') {
    return '#BA24D5';
  }
  if (modStatus === 'movement') {
    return '#155EEF';
  }
  if (modStatus === 'holiday') {
    return '#4E5BA6';
  }
  if (modStatus === 'offday') {
    return '#667085';
  }
  if (modStatus === 'present') {
    return '#299647';
  }
};

export const getAttendanceBgStatusColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'absent') {
    return '#FEE4E2';
  }
  if (modStatus === 'late') {
    return '#FEF0C7';
  }
  if (modStatus === 'leave') {
    return '#FBE8FF';
  }
  if (modStatus === 'movement') {
    return '#E5F3FF';
  }
  if (modStatus === 'holiday') {
    return '#EAECF5';
  }
  if (modStatus === 'offday') {
    return '#F2F4F7';
  }
  if (modStatus === 'present') {
    return '#E6F9E9';
  }
};

export const dividerColor = (status: string) => {
  let modStatus = status?.trim().toLowerCase();
  if (modStatus === 'financial') {
    return '#2ECC71';
  }
  if (modStatus === 'customer') {
    return '#3498DB';
  }
  if (modStatus === 'process') {
    return '#E67E22';
  } else {
    return '#FF7F50';
  }
};

export const getMeetingStatusBgColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'upcoming') {
    return '#EAAA08';
  } else if (modStatus === 'draft save') {
    return '#667085';
  } else if (modStatus === 'inprogress') {
    return '#2E90FA';
  } else if (modStatus === 'completed') {
    return '#039855';
  } else if (modStatus === 'canceled') {
    return '#D92D20';
  } else if (modStatus === 'postponed') {
    return '#D444F1';
  } else if (modStatus === 'expired') {
    return 'gray';
  } else {
    return '#E6F9E9';
  }
};

export const getTodoMasterBgColor = (status: string) => {
  let modStatus = status?.toLowerCase()?.trim();
  if (modStatus === 'do first') {
    return '#039855';
  } else if (modStatus === 'schedule') {
    return '#0BA5EC';
  } else if (modStatus === 'delegate') {
    return '#EAAA08';
  } else if (modStatus === 'don’t do' || modStatus === "don't do") {
    return '#D92D20';
  } else {
    return '#E6F9E9';
  }
};

export const getBiddingStatusBgColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'applied') {
    return '#EAAA08';
  } else if (modStatus === 'win') {
    return '#039855';
  } else if (modStatus === 'lost') {
    return '#D92D20';
  } else if (modStatus === 'miss') {
    return '#767873';
  } else {
    return '#E6F9E9';
  }
};

export const getMeetingBgColor = (status: string) => {
  let modStatus = status?.toLowerCase()?.trim();
  if (modStatus === 'confirmed' || modStatus === 'accepted') {
    return COLORS.primary;
  } else if (modStatus === 'declined') {
    return COLORS.red;
  } else {
    return COLORS.yellow;
  }
};

export const getMeetingDiscussionBgColor = (status: string) => {
  let modStatus = status?.toLowerCase()?.trim();
  if (modStatus === 'allowed') {
    return COLORS.primary;
  } else if (modStatus === 'declined') {
    return COLORS.red;
  } else {
    return COLORS.yellow;
  }
};

export const getEmpProficiencyBgColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'beginner') {
    return '#FEF7C3';
  } else if (modStatus === 'intermediate') {
    return '#E0F2FE';
  } else if (modStatus === 'expert') {
    return '#D1FADF';
  } else {
    return '#E6F9E9';
  }
};

export const getEmpProficiencyTxtColor = (status: string) => {
  let modStatus = status?.toLowerCase();
  if (modStatus === 'beginner') {
    return '#713B12';
  } else if (modStatus === 'intermediate') {
    return '#026AA2';
  } else if (modStatus === 'expert') {
    return '#027A48';
  } else {
    return COLORS.primary;
  }
};
