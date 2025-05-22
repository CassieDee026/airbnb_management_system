"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { UploadButton } from '../uploadthings';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Loader2, Pencil, PencilLine, XCircle } from 'lucide-react';
import axios from 'axios';
import uselocation from '@/hooks/uselocation';
import { ICity, IState } from 'country-state-city';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { House, Room } from '@prisma/client';

interface AddHouseFormProps {
  house: House | null;
}

export type HouseWithRoom = House & {
  rooms: Room[];
};

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  image: z.string().min(1, { message: 'Image is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  county: z.string().min(1, { message: 'County is required' }),
  city: z.string().optional(),
  locationDescription: z.string().min(10, { message: 'Location description must be at least 10 characters long' }),
  gym: z.boolean().optional(),
  spar: z.boolean().optional(),
  bar: z.boolean().optional(),
  parking: z.boolean().optional(),
  swimmingpool: z.boolean().optional(),
});

const AddHouseForm = ({ house }: AddHouseFormProps) => {
  const [image, setImage] = useState<string | undefined>(house?.image || '');
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();
  const { getAllCountries, getCountryStates, getStateCities } = uselocation();
  const countries = getAllCountries();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: house || {
      title: "",
      description: "",
      image: "",
      country: "",
      county: "",
      city: "",
      locationDescription: "",
      gym: false,
      spar: false,
      bar: false,
      parking: false,
      swimmingpool: false,
    },
  });

  useEffect(() => {
    if (typeof image === 'string') {
      form.setValue('image', image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }
  }, [image, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'country') {
        const selectedCountry = value.country;
        if (selectedCountry) {
          const countryStates = getCountryStates(selectedCountry);
          setStates(countryStates || []);
          setCities([]); // Reset cities when country changes
          form.setValue('county', ''); // Reset state when country changes
          form.setValue('city', ''); // Reset city when country changes
        }
      } else if (name === 'county') {
        const selectedCountry = form.getValues('country');
        const selectedState = value.county;
        if (selectedCountry && selectedState) {
          const stateCities = getStateCities(selectedCountry, selectedState);
          setCities(stateCities || []);
          form.setValue('city', ''); // Reset city when state changes
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, getCountryStates, getStateCities]);

  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (house) {
        // Update logic
        axios.put(`/api/house/${house.id}`, values).then(() => {
        toast({
          variant: "success", 
          description: 'House has been updated!'
        });
        router.push(`/house/${house.id}`);
        }).catch((err) =>{
          console.log(err);
          toast({
            variant: "destructive",
            description: "something went wrong"
          })
        })
      } else {
        // Create logic
        const res = await axios.post('/api/house', values);
        toast({
          variant: "success", // Corrected variant
          description: 'House has been created!'
        });
        router.push(`/house/${res.data.id}`);
      }
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        description: 'Something went wrong!'
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleImageDelete = (image: string) => {
    setImageIsDeleting(true);
    const imagekey = image.substring(image.lastIndexOf('/') + 1);

    axios.post('/api/uploadthing/delete', { imagekey }).then((res) => {
      if (res.data.success) {
        setImage('');
        form.setValue('image', '');
        toast({
          variant: 'success',
          description: 'Image removed'
        });
      }
    }).catch(() => {
      toast({
        variant: 'destructive',
        description: 'Something went wrong'
      });
    }).finally(() => {
      setImageIsDeleting(false);
    });
  }

  return (
    <div className="container mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className='text-lg font-semibold'>{house ? 'Update your house!' : 'Describe your house!'}</h3>
          <div className='flex flex-col md:flex-row gap-6'>
            <div className='flex-1 flex flex-col gap-6'>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Title *</FormLabel>
                    <FormDescription>
                      Provide your house Apartment name.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="View of house" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Description *</FormLabel>
                    <FormDescription>
                      Provide detailed information about your house.
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="House has many awesome amenities" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Choose Amenities</FormLabel>
                <FormDescription>Display amenities in your house</FormDescription>
                <div className='grid grid-cols-2 gap-4 mt-2'>
                  <FormField
                    control={form.control}
                    name="gym"
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Gym</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spar"
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Spar</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bar"
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Bar</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parking"
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Parking</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="swimmingpool"
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-end space-x-3 rounded-md border p-4'>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Swimmingpool</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem className='flex flex-col space-y-3'>
                    <FormLabel>Upload an Image *</FormLabel>
                    <FormDescription>Choose an image that will showcase the house nicely.</FormDescription>
                    <FormControl>
                      {image ? (
                        <>
                          <div className='relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4'>
                            <Image
                              src={image}
                              alt='House Image'
                              layout='fill'
                              className='object-contain'
                            />
                            <Button
                              onClick={() => handleImageDelete(image)}
                              type='button'
                              size='icon'
                              variant='ghost'
                              className='absolute right-[-12px] top-0'
                            >
                              {imageIsDeleting ? <Loader2 /> : <XCircle />}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className='flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4'>
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              console.log("Files: ", res);
                              setImage(res[0].url);
                              toast({
                                variant: 'success',
                                description: 'Upload Completed'
                              });
                            }}
                            onUploadError={(error: Error) => {
                              toast({
                                variant: 'destructive',
                                description: `ERROR! ${error.message}`
                              });
                            }}
                          />
                        </div>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className='flex-1 flex flex-col gap-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Country *</FormLabel>
                      <FormDescription>In which country is your property located?</FormDescription>
                      <Select
                        disabled={isLoading}
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue defaultValue={field.value} placeholder="Select a Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => {
                            return <SelectItem key={country.isoCode} value={country.isoCode}>{country.name}</SelectItem>
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='county'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select County</FormLabel>
                      <FormDescription>In which county is your property located?</FormDescription>
                      <Select
                        disabled={isLoading || states.length < 1}
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue defaultValue={field.value} placeholder="Select County" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => {
                            return <SelectItem key={state.isoCode} value={state.isoCode}>{state.name}</SelectItem>
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select City</FormLabel>
                      <FormDescription>In which town/city is your property located?</FormDescription>
                      <Select
                        disabled={isLoading || cities.length < 1}
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue defaultValue={field.value} placeholder="Select a City" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => {
                            return <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Description *</FormLabel>
                      <FormDescription>
                        Provide a detailed location of your Airbnb.
                      </FormDescription>
                      <FormControl>
                        <Textarea placeholder="Located at the very end of the beach road!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-between gap-2 flex-wrap'>
                  {house ? <Button className='max-w-[150px]' disabled={isLoading}> {isLoading ? <><Loader2 className='mr-2 h-4 w-4' />Updating</> : <><PencilLine
                    className='mr-2 h-4 w-4' /> Update</>}</Button> : <Button className='max-w-[150px]' disabled={isLoading}>
                    {isLoading ? <><Loader2 className='mr-2 h-4 w-4' />Creating </> : <><Pencil className='mr-2 h-4 w-4' />
                      Create House</>}
                  </Button>}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHouseForm;