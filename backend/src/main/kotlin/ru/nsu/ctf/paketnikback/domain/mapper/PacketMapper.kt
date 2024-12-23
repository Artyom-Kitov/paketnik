package ru.nsu.ctf.paketnikback.domain.mapper

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import ru.nsu.ctf.paketnikback.domain.dto.PacketStreamResponse
import ru.nsu.ctf.paketnikback.domain.dto.UnallocatedPacketDto
import ru.nsu.ctf.paketnikback.domain.entity.packet.UnallocatedPacketDocument
import ru.nsu.ctf.paketnikback.domain.entity.stream.PacketStreamDocument

@Mapper(componentModel = "spring")
interface PacketMapper {
    @Mapping(target = "service", expression = "java(null)")
    fun streamToResponse(packetStreamDocument: PacketStreamDocument): PacketStreamResponse

    fun unallocatedToDto(unallocatedPacketDocument: UnallocatedPacketDocument): UnallocatedPacketDto
}
