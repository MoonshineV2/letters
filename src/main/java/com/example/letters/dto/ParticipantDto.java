package com.example.letters.dto;

import com.example.letters.model.Participant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantDto {
    public int id;
    public String fullName;
    public String initials;
    public String post;
    public boolean canSign;

    public static ParticipantDto fromParticipant(Participant participant) {
        return new ParticipantDto(
                participant.getId(),
                participant.getFullName(),
                participant.getInitials(),
                participant.getPost(),
                participant.isCanSign()
        );
    }

    public Participant toParticipant() {
        return new Participant(
                id,
                fullName,
                initials,
                post,
                canSign
        );
    }
}
