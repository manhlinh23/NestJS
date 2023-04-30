import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MyJwt } from '../auth/guard';
import { NoteService } from './note.service';
import { GetUser } from '../auth/decorator';
import { InsetNoteDTO, UpdateNoteDTO } from './dto/index';

@UseGuards(MyJwt)
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Get()
  getNotes(@GetUser('id') userId: number) {
    return this.noteService.getNotes(userId);
  }

  @Get('/:id') // eg: /notes/123
  getNoteById(@Param('id') noteId: number) {
    return this.noteService.getNoteById(noteId);
  }

  @Post()
  insertNotes(@GetUser('id') userId: number, @Body() body: InsetNoteDTO) {
    return this.noteService.insertNotes(userId, body);
  }

  @Patch(':id')
  updatetNotes(
    //ParseIntPipe: requied id is number
    @Param('id', ParseIntPipe) noteId: number,
    @Body() body: UpdateNoteDTO,
  ) {
    return this.noteService.updatetNotes(noteId, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteNotes(@Query('id', ParseIntPipe) noteId: number) {
    return this.noteService.deleteNotes(noteId);
  }
}
