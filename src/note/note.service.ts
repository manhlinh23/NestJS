import { ForbiddenException, Injectable } from '@nestjs/common';
import { InsetNoteDTO, UpdateNoteDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  getNotes(userId: number) {
    const notes = this.prismaService.note.findMany({
      where: { userId },
    });
    return notes;
  }
  async getNoteById(noteId: number) {
    try {
      const note = await this.prismaService.note.findUnique({
        where: {
          id: +noteId,
        },
      });
      if (!note) {
        throw new Error('no note exists');
      }
      return note;
    } catch (error) {
      throw new ForbiddenException('erorr');
    }
  }
  async insertNotes(userId: number, body: InsetNoteDTO) {
    await this.prismaService.note.create({
      data: {
        ...body,
        userId,
      },
    });
    return `insert note success to userId ${userId}`;
  }

  async updatetNotes(
    //ParseIntPipe: requied id is number
    noteId: number,
    body: UpdateNoteDTO,
  ) {
    console.log('noteId', noteId);
    try {
      await this.prismaService.note.update({
        where: {
          id: noteId,
        },
        data: {
          ...body,
        },
      });

      return this.getNoteById(noteId);
    } catch (error) {
      throw new ForbiddenException('No note found');
    }
  }
  async deleteNotes(noteId: number) {
    try {
      await this.prismaService.note.delete({
        where: {
          id: noteId,
        },
      });
      return `Deleted note id = ${noteId}`;
    } catch (error) {
      throw new ForbiddenException('not found note');
    }
  }
}
