package com.example.letters.dto;

import com.example.letters.model.Participant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantDto {
    public int id;
    public String fullName;
    public String initials;
    public String post;
    public boolean canSign;
    public boolean disabled;
    public String email;

    public static ParticipantDto fromParticipant(Participant participant) {
        return new ParticipantDto(
                participant.getId(),
                participant.getFullName(),
                participant.getInitials(),
                participant.getPost(),
                participant.isCanSign(),
                participant.isDisabled(),
                participant.getEmail()
        );
    }

    public Participant toParticipant() {
        return new Participant(
                id,
                fullName,
                initials,
                post,
                canSign,
                disabled,
                email
        );
    }
}
