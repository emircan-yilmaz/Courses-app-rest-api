import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createCourseDto } from './dto/create-course.dto';
import { updateCourseDto } from './dto/update-course.dto';
import { CourseInterface } from './interfaces/course.interface';

@Injectable()
export class CourseService {
  constructor(@InjectModel('Course') private Course: Model<CourseInterface>) {}

  async getAllCourses() {
    const data = await this.Course.find();

    return {
      results: data.length,
      courses: data,
    };
  }

  async createCourse(course: createCourseDto, ownerId: string) {
    const data = await this.Course.create({
      ...course,
      administrators: [ownerId],
    });

    return data;
  }

  async getCourse(id: string) {
    const data = await this.Course.findById(id);

    if (!data) throw new NotFoundException();

    return data;
  }

  async updateCourse(id: string, update: updateCourseDto) {
    const data = await this.Course.findByIdAndUpdate(id, update, {
      new: true,
    });

    return data;
  }

  async deleteCourse(id: string) {
    await this.Course.findByIdAndDelete(id);
  }

  async getAllSectionsOfCourse(courseId: string) {
    const course = await this.Course.findById(courseId).populate('sections');
    if (!course) throw new NotFoundException('Course not found');
    return course.sections;
  }

  // if we sure course exists, we can use this method
  async createSectionForCourse(courseId: string, sectionId: string) {
    const course = await this.Course.findById(courseId);
    course.sections.push(sectionId);
    await course.save();
  }

  async deleteSectionFromCourse(courseId: string, sectionId: string) {
    const course = await this.Course.findById(courseId);
    const sectionIndex = course.sections.findIndex(
      (el) => el.toString() === sectionId.toString(),
    );
    course.sections.splice(sectionIndex, 1);
    await course.save();
  }
}
